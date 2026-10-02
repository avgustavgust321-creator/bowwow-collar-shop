"use server";

import { deliveryById } from "@/content/delivery";
import { getProduct } from "@/lib/catalog";
import { notifyOrder } from "@/lib/notify";
import { generateOrderId, saveOrder, updateOrderStatus } from "@/lib/orders/store";
import { getPaymentProvider } from "@/lib/payments";
import {
  checkoutInputSchema,
  type Order,
  type OrderLine,
} from "@/lib/orders/types";
import {
  calcPrice,
  describeConfiguration,
  validateConfiguration,
} from "@/lib/price";

export type CheckoutResult =
  | { ok: true; orderId: string; redirectUrl?: string }
  | { ok: false; errors: string[] };

/**
 * Оформление заказа.
 *
 * Цену с клиента не принимаем вообще: приходят только товар, конфигурация
 * и количество, всё остальное пересчитывается здесь тем же кодом,
 * что и в корзине.
 */
export async function submitOrder(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((i) => i.message) };
  }

  const { customer, lines } = parsed.data;
  const errors: string[] = [];
  const orderLines: OrderLine[] = [];
  let itemsTotal = 0;
  let approximate = false;

  for (const line of lines) {
    const product = getProduct(line.slug);
    if (!product) {
      errors.push(`Товара «${line.slug}» больше нет в каталоге`);
      continue;
    }
    // Черновик ещё без настоящей цены — заказать его нельзя, даже если
    // кто-то положил его в корзину в обход кнопки
    if (product.draft) {
      errors.push(`${product.title}: скоро в продаже, заказ пока не принимается`);
      continue;
    }

    // Ошейник по идее покупателя обсуждается в инстаграме, а не
    // оформляется корзиной: цену мастер называет после разговора
    if (product.viaInstagram) {
      errors.push(`${product.title}: обсуждается в инстаграме, через корзину не оформляется`);
      continue;
    }

    const configErrors = validateConfiguration(product, line.config);
    if (configErrors.length > 0) {
      errors.push(`${product.title}: ${configErrors.join(", ")}`);
      continue;
    }

    const price = calcPrice(product, line.config);
    itemsTotal += price.total * line.qty;
    approximate = approximate || price.approximate;

    orderLines.push({
      slug: product.slug,
      title: product.title,
      options: describeConfiguration(product, line.config),
      qty: line.qty,
      unitPrice: price.total,
      approximate: price.approximate,
    });
  }

  const delivery = deliveryById.get(customer.delivery);
  if (!delivery) {
    errors.push("Выберите способ доставки");
  } else if (delivery.needsAddress && !customer.address?.trim()) {
    errors.push("Укажите адрес доставки");
  }

  if (errors.length > 0) return { ok: false, errors };

  const deliveryPrice = delivery?.price ?? 0;

  const order: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "new",
    customer,
    lines: orderLines,
    itemsTotal,
    deliveryPrice,
    total: itemsTotal + deliveryPrice,
    approximate,
    currency: "BYN",
  };

  try {
    await saveOrder(order);
  } catch (error) {
    console.error("[order] не удалось сохранить заказ", error);
    return {
      ok: false,
      errors: [
        "Не удалось сохранить заказ. Попробуйте ещё раз или напишите нам в Instagram.",
      ],
    };
  }

  await notifyOrder(order);

  // Оплата по индивидуальным замерам не запускается: сумма ещё
  // предварительная, её сначала подтверждает мастер.
  if (!order.approximate) {
    try {
      const payment = await getPaymentProvider().start(order);
      if (payment.kind === "redirect") {
        await updateOrderStatus(order.id, "pending_payment", {
          paymentId: payment.paymentId,
        });
        return { ok: true, orderId: order.id, redirectUrl: payment.url };
      }
    } catch (error) {
      // Заказ уже принят и мастер о нём знает — оплату досогласуем вручную.
      console.error("[order] не удалось создать платёж", error);
    }
  }

  return { ok: true, orderId: order.id };
}
