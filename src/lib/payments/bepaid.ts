import type { Order } from "@/lib/orders/types";
import { siteOrigin, type PaymentProvider } from "@/lib/payments";

/**
 * Эквайринг bePaid (Беларусь).
 *
 * Схема: создаём платёжную сессию (checkout token), уводим клиента на
 * платёжную страницу bePaid, а результат принимаем вебхуком. Статус
 * заказа меняем только после проверки транзакции запросом к API —
 * телу вебхука на слово не верим.
 *
 * ⚠ Не проверено на боевых ключах: нужен договор с bePaid и данные
 * BEPAID_SHOP_ID / BEPAID_SECRET_KEY. Проверять в песочнице
 * (BEPAID_TEST_MODE=true).
 */

const CHECKOUT_URL = "https://checkout.bepaid.by/ctp/api/checkouts";
const GATEWAY_URL = "https://gateway.bepaid.by/transactions";

function authHeader(): string {
  const shopId = process.env.BEPAID_SHOP_ID ?? "";
  const secret = process.env.BEPAID_SECRET_KEY ?? "";
  return `Basic ${Buffer.from(`${shopId}:${secret}`).toString("base64")}`;
}

/** bePaid принимает сумму в копейках. */
function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export const bepaidProvider: PaymentProvider = {
  id: "bepaid",

  async start(order: Order) {
    const origin = siteOrigin();

    const body = {
      checkout: {
        version: 2.1,
        test: process.env.BEPAID_TEST_MODE !== "false",
        transaction_type: "payment",
        attempts: 3,
        settings: {
          language: "ru",
          success_url: `${origin}/order/${order.id}?payment=success`,
          decline_url: `${origin}/order/${order.id}?payment=decline`,
          fail_url: `${origin}/order/${order.id}?payment=fail`,
          cancel_url: `${origin}/order/${order.id}?payment=cancel`,
          notification_url: `${origin}/api/payments/bepaid/webhook`,
        },
        order: {
          amount: toMinorUnits(order.total),
          currency: order.currency,
          description: `Заказ ${order.id} — BOW WOW COLLAR`,
          tracking_id: order.id,
        },
        customer: {
          email: order.customer.email,
          first_name: order.customer.name,
          phone: order.customer.phone,
        },
      },
    };

    const res = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`bePaid вернул ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as {
      checkout?: { token?: string; redirect_url?: string };
    };

    const url = data.checkout?.redirect_url;
    const token = data.checkout?.token;
    if (!url || !token) {
      throw new Error("bePaid не вернул ссылку на оплату");
    }

    return { kind: "redirect" as const, url, paymentId: token };
  },
};

/**
 * Проверка транзакции по её uid из вебхука.
 * Возвращает true, только если банк подтвердил успешную оплату.
 */
export async function verifyTransaction(uid: string): Promise<{
  successful: boolean;
  trackingId?: string;
}> {
  const res = await fetch(`${GATEWAY_URL}/${encodeURIComponent(uid)}`, {
    headers: { Authorization: authHeader(), Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`bePaid вернул ${res.status} при проверке транзакции`);
  }

  const data = (await res.json()) as {
    transaction?: { status?: string; tracking_id?: string };
  };

  return {
    successful: data.transaction?.status === "successful",
    trackingId: data.transaction?.tracking_id,
  };
}
