import { deliveryById } from "@/content/delivery";
import { site } from "@/content/site";
import { formatPrice } from "@/lib/catalog";
import type { Order } from "@/lib/orders/types";

/**
 * Уведомления о заказе: сообщение мастеру в Telegram и письмо клиенту.
 * Оба канала работают по HTTP без SDK. Если переменные окружения не
 * заданы, отправка тихо пропускается — заказ всё равно сохраняется.
 */

function orderText(order: Order): string {
  const delivery = deliveryById.get(order.customer.delivery);
  const lines = order.lines
    .map((line) => {
      const options = line.options.map((o) => `    ${o}`).join("\n");
      return (
        `• ${line.title} × ${line.qty} — ${line.approximate ? "от " : ""}` +
        `${formatPrice(line.unitPrice * line.qty)}\n${options}`
      );
    })
    .join("\n");

  return [
    `Заказ ${order.id}`,
    "",
    lines,
    "",
    `Доставка: ${delivery?.title ?? order.customer.delivery}`,
    order.customer.address ? `Адрес: ${order.customer.address}` : null,
    `Итого: ${order.approximate ? "от " : ""}${formatPrice(order.total)}`,
    "",
    `Имя: ${order.customer.name}`,
    `Телефон: ${order.customer.phone}`,
    `Почта: ${order.customer.email}`,
    order.customer.comment ? `Комментарий: ${order.customer.comment}` : null,
    order.approximate
      ? "\n⚠ В заказе есть позиции с предварительной ценой — подтвердите сумму клиенту."
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Настроены ли уведомления — для страницы проверки, без самих ключей */
export function telegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

async function sendTelegram(order: Order): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn(
      `[notify] Telegram не настроен — заказ ${order.id} сохранён без уведомления`,
    );
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: orderText(order),
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram вернул ${res.status}: ${await res.text()}`);
  }
}

async function sendEmail(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  if (!apiKey || !from) return;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h1 style="font-size:20px">Заказ ${order.id} принят</h1>
      <p>Спасибо! Мы получили заказ и свяжемся с вами для подтверждения.</p>
      <pre style="white-space:pre-wrap;background:#f6f2ea;padding:16px;font-family:inherit">${orderText(
        order,
      )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</pre>
      <p>${site.name} · ${site.contacts.instagramHandle}</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: order.customer.email,
      subject: `Заказ ${order.id} — ${site.name}`,
      html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend вернул ${res.status}: ${await res.text()}`);
  }
}

/**
 * Оповещения не должны ронять оформление заказа: заказ уже сохранён,
 * поэтому ошибку канала логируем, но наверх не бросаем.
 */
export async function notifyOrder(order: Order): Promise<void> {
  const results = await Promise.allSettled([
    sendTelegram(order),
    sendEmail(order),
  ]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[notify]", result.reason);
    }
  }
}
