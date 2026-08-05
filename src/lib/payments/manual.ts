import type { PaymentProvider } from "@/lib/payments";

/**
 * Режим без онлайн-оплаты: заказ сохраняется и уходит мастеру,
 * оплата обсуждается отдельно. Используется, пока не подключён эквайринг.
 */
export const manualProvider: PaymentProvider = {
  id: "manual",
  async start() {
    return { kind: "none" };
  },
};
