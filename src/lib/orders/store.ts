import type { Order, OrderStatus } from "@/lib/orders/types";

/**
 * Хранилище заказов.
 *
 * В продакшене — Upstash Redis по REST API (бесплатный тариф, без SDK
 * и без своей базы). Если переменные окружения не заданы, заказы живут
 * в памяти процесса: этого хватает для локальной разработки, но на
 * Vercel такой заказ пропадёт при следующем холодном старте — поэтому
 * при старте пишем предупреждение.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedis = Boolean(REDIS_URL && REDIS_TOKEN);

const memory = new Map<string, Order>();
let warned = false;

function warnOnce() {
  if (hasRedis || warned) return;
  warned = true;
  console.warn(
    "[orders] UPSTASH_REDIS_REST_URL не задан — заказы хранятся в памяти процесса. " +
      "Для боевого режима задайте переменные окружения (см. .env.example).",
  );
}

async function redis(command: unknown[]): Promise<unknown> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
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

export async function saveOrder(order: Order): Promise<void> {
  warnOnce();
  if (hasRedis) {
    await redis(["SET", key(order.id), JSON.stringify(order)]);
    await redis(["LPUSH", "orders:index", order.id]);
    return;
  }
  memory.set(order.id, order);
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
  await saveOrder(next);
  return next;
}
