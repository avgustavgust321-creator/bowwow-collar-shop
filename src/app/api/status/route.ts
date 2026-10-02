import { NextResponse } from "next/server";
import { telegramConfigured } from "@/lib/notify";
import { pingStorage, storageEnvNames, storageMode } from "@/lib/orders/store";

/**
 * Проверка настроек: подключены ли хранилище заказов и Telegram.
 * Отдаёт только «да/нет» — ни адресов, ни ключей, ни данных заказов.
 */
export async function GET() {
  const storage = storageMode();
  const ping = await pingStorage();
  const telegram = telegramConfigured();
  return NextResponse.json(
    {
      ready: ping === "ok" && telegram,
      orders: storage === "redis" ? "сохраняются в базе" : "НЕ сохраняются (нет базы)",
      database: ping,
      telegram: telegram ? "подключён" : "не подключён",
      // Только имена настроек — значения никогда не показываем
      storageSettingsFound: storageEnvNames(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
