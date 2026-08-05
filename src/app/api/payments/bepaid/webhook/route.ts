import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/orders/store";
import { verifyTransaction } from "@/lib/payments/bepaid";

/**
 * Вебхук bePaid.
 *
 * Телу запроса не доверяем: из него берём только uid транзакции,
 * а статус подтверждаем отдельным запросом к API bePaid. Иначе кто
 * угодно мог бы отправить сюда «оплачено» и получить заказ бесплатно.
 */
export async function POST(request: Request) {
  let payload: { transaction?: { uid?: string; tracking_id?: string } };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const uid = payload.transaction?.uid;
  if (!uid) {
    return NextResponse.json({ error: "Нет uid транзакции" }, { status: 400 });
  }

  try {
    const { successful, trackingId } = await verifyTransaction(uid);
    const orderId = trackingId ?? payload.transaction?.tracking_id;

    if (!orderId) {
      return NextResponse.json({ error: "Нет номера заказа" }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    await updateOrderStatus(orderId, successful ? "paid" : "failed", {
      paymentId: uid,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[bepaid webhook]", error);
    // 500 — bePaid повторит доставку вебхука
    return NextResponse.json({ error: "Ошибка обработки" }, { status: 500 });
  }
}
