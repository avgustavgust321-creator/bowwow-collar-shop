import type { Order } from "@/lib/orders/types";
import { bepaidProvider } from "@/lib/payments/bepaid";
import { manualProvider } from "@/lib/payments/manual";

/**
 * Оплата спрятана за одним интерфейсом, поэтому страницы и оформление
 * заказа не знают, кто именно принимает деньги.
 *
 *  manual — заказ уходит мастеру, оплата по договорённости (работает сразу);
 *  bepaid — эквайринг: нужны BEPAID_SHOP_ID и BEPAID_SECRET_KEY.
 *
 * Переключается переменной PAYMENT_PROVIDER, код страниц не меняется.
 */
export type StartPaymentResult =
  | { kind: "none" }
  | { kind: "redirect"; url: string; paymentId: string };

export type PaymentProvider = {
  id: string;
  /** Начать оплату. Возвращает адрес платёжной страницы, если он нужен. */
  start(order: Order): Promise<StartPaymentResult>;
};

export function getPaymentProvider(): PaymentProvider {
  const configured = process.env.PAYMENT_PROVIDER ?? "manual";

  if (configured === "bepaid") {
    if (!process.env.BEPAID_SHOP_ID || !process.env.BEPAID_SECRET_KEY) {
      console.warn(
        "[payments] PAYMENT_PROVIDER=bepaid, но BEPAID_SHOP_ID/BEPAID_SECRET_KEY не заданы — " +
          "заказы оформляются без онлайн-оплаты.",
      );
      return manualProvider;
    }
    return bepaidProvider;
  }

  return manualProvider;
}

/** Публичный адрес сайта — нужен для ссылок возврата с платёжной страницы. */
export function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}
