import { createClient } from "redis";
import type { Order, OrderStatus } from "@/lib/orders/types";

/**
 * Хранилище заказов — Redis.
 *
 * Подключается двумя способами, смотря что выбрано во вкладке Storage
 * на Vercel:
 *   • Upstash — по HTTP, настройки KV_REST_API_URL и KV_REST_API_TOKEN
 *     (или UPSTASH_REDIS_REST_*);
 *   • Redis Cloud — обычным подключением по одному адресу REDIS_URL.
 *
 * Если не задано ни то ни другое, заказы живут в памяти процесса: этого
 * хватает для локальной разработки, но на Vercel такой заказ пропадёт
 * при следующем холодном старте — поэтому пишем предупреждение.
 */

// При подключении Vercel разрешает добавить к именам свою приставку
// (например STORAGE_KV_REST_API_URL), поэтому ищем и по окончанию имени.
function envBySuffix(...suffixes: string[]): string | undefined {
  for (const suffix of suffixes) {
    if (process.env[suffix]) return process.env[suffix];
  }
  for (const suffix of suffixes) {
    const name = Object.keys(process.env).find(
      (n) => n.endsWith(`_${suffix}`) && process.env[n],
    );
    if (name) return process.env[name];
  }
  return undefined;
}

const REST_URL = envBySuffix("UPSTASH_REDIS_REST_URL", "KV_REST_API_URL");
const REST_TOKEN = envBySuffix("UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN");
const hasRest = Boolean(REST_URL && REST_TOKEN);
const TCP_URL = hasRest ? undefined : envBySuffix("REDIS_URL", "KV_URL");
const hasRedis = hasRest || Boolean(TCP_URL);

/**
 * Имена (не значения!) настроек, похожих на базу, — чтобы по странице
 * проверки было видно, что Vercel подключил, если сайт базу не нашёл.
 */
export function storageEnvNames(): string[] {
  return Object.keys(process.env)
    .filter((n) => /REDIS|KV_|UPSTASH/.test(n))
    .sort();
}

/** Где сейчас живут заказы — для страницы проверки настроек */
export function storageMode(): "redis" | "memory" {
  return hasRedis ? "redis" : "memory";
}

const memory = new Map<string, Order>();
let warned = false;

function warnOnce() {
  if (hasRedis || warned) return;
  warned = true;
  console.warn(
    "[orders] База не подключена — заказы хранятся в памяти процесса. " +
      "Подключите Redis во вкладке Storage на Vercel (см. .env.example).",
  );
}

async function restCommand(command: string[]): Promise<unknown> {
  const res = await fetch(REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash вернул ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { result?: unknown };
  return data.result;
}

// Одно подключение на весь процесс: функция на Vercel живёт какое-то
// время между заказами, и переподключаться каждый раз незачем
let tcpClient: Promise<ReturnType<typeof createClient>> | null = null;

function getTcpClient() {
  tcpClient ??= (async () => {
    const client = createClient({ url: TCP_URL });
    client.on("error", (error) => console.error("[orders] Redis:", error));
    await client.connect();
    return client;
  })().catch((error) => {
    // Не запоминаем неудачное подключение — следующий заказ попробует снова
    tcpClient = null;
    throw error;
  });
  return tcpClient;
}

async function redis(command: string[]): Promise<unknown> {
  if (hasRest) return restCommand(command);
  const client = await getTcpClient();
  return client.sendCommand(command);
}

/** Отвечает ли база: для страницы проверки, заказов не трогает */
export async function pingStorage(): Promise<"ok" | "нет базы" | string> {
  if (!hasRedis) return "нет базы";
  try {
    const answer = await Promise.race([
      redis(["PING"]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("нет ответа за 5 секунд")), 5000),
      ),
    ]);
    return answer === "PONG" ? "ok" : `неожиданный ответ: ${String(answer)}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Страница проверки открыта всем — адрес базы с паролем вырезаем
    return `ошибка: ${message.replace(/rediss?:\/\/\S+/g, "[адрес базы]")}`;
  }
}

const key = (id: string) => `order:${id}`;

/** Номер заказа вида BW-7K3P2Q — короткий, читается по телефону. */
export function generateOrderId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 6; i++) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `BW-${tail}`;
}

/** Записать заказ целиком — и новый, и обновлённый */
async function putOrder(order: Order): Promise<void> {
  warnOnce();
  if (hasRedis) {
    await redis(["SET", key(order.id), JSON.stringify(order)]);
    return;
  }
  memory.set(order.id, order);
}

/** Новый заказ: записываем и ставим в начало списка заказов */
export async function saveOrder(order: Order): Promise<void> {
  await putOrder(order);
  // В список — только при создании. Раньше смена статуса заново
  // добавляла номер, и один заказ появлялся в списке дважды
  if (hasRedis) await redis(["LPUSH", "orders:index", order.id]);
}

export async function getOrder(id: string): Promise<Order | null> {
  warnOnce();
  if (hasRedis) {
    const raw = await redis(["GET", key(id)]);
    return typeof raw === "string" ? (JSON.parse(raw) as Order) : null;
  }
  return memory.get(id) ?? null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  patch: Partial<Order> = {},
): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const next: Order = { ...order, ...patch, status };
  await putOrder(next);
  return next;
}
