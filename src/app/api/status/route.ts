import { NextResponse } from "next/server";
import { telegramConfigured } from "@/lib/notify";
import { storageMode } from "@/lib/orders/store";

/**
 * Проверка настроек: подключены ли хранилище заказов и Telegram.
 * Отдаёт только «да/нет» — ни адресов, ни ключей, ни данных заказов.
 */
export function GET() {
  const storage = storageMode();
  const telegram = telegramConfigured();
  return NextResponse.json(
    {
      ready: storage === "redis" && telegram,
      orders: storage === "redis" ? "сохраняются в базе" : "НЕ сохраняются (нет базы)",
      telegram: telegram ? "подключён" : "не подключён",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
