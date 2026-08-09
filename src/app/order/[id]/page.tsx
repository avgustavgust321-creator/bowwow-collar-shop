import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deliveryById } from "@/content/delivery";
import { site } from "@/content/site";
import { formatPrice } from "@/lib/catalog";
import { getOrder } from "@/lib/orders/store";
import type { OrderStatus } from "@/lib/orders/types";

export const metadata: Metadata = {
  title: "Заказ",
  robots: { index: false },
};

const statusText: Record<OrderStatus, string> = {
  new: "Принят, ждёт подтверждения",
  pending_payment: "Ожидает оплаты",
  paid: "Оплачен",
  failed: "Оплата не прошла",
};

/** Сообщения по результату возврата с платёжной страницы. */
const paymentNotice: Record<string, string> = {
  decline: "Банк отклонил оплату. Попробуйте другую карту или свяжитесь с нами.",
  fail: "Оплата не прошла. Заказ сохранён — мы напишем вам и поможем оплатить.",
  cancel: "Оплата отменена. Заказ сохранён, оплатить можно позже.",
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const order = await getOrder(id);
  if (!order) notFound();

  const paymentParam = Array.isArray(sp.payment) ? sp.payment[0] : sp.payment;
  const notice = paymentParam ? paymentNotice[paymentParam] : undefined;
  const delivery = deliveryById.get(order.customer.delivery);

  return (
    <section className="wrap px-5 py-16 md:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="label text-forest">Спасибо за заказ</p>
        <h1 className="display mt-3 text-4xl md:text-6xl">Заказ {order.id}</h1>
        <p className="mt-4 text-muted">
          {statusText[order.status]}. Мы напишем вам на{" "}
          {order.customer.email} и позвоним на {order.customer.phone}, чтобы
          подтвердить детали.
        </p>

        {notice && (
          <p className="mt-6 border-l-2 border-gold bg-shell px-4 py-3 text-sm">
            {notice}
          </p>
        )}

        {order.approximate && (
          <p className="mt-6 border-l-2 border-gold bg-shell px-4 py-3 text-sm">
            В заказе есть позиции по индивидуальным замерам. Мастер проверит
            размеры и подтвердит окончательную стоимость до начала работы.
          </p>
        )}

        <ul className="mt-10 flex flex-col border-t border-line">
          {order.lines.map((line, i) => (
            <li key={`${line.slug}-${i}`} className="border-b border-line py-5">
              <div className="flex flex-wrap justify-between gap-3">
                <span className="display text-lg">
                  {line.title} × {line.qty}
                </span>
                <span className="font-semibold">
                  {line.approximate && <span className="text-muted">от </span>}
                  {formatPrice(line.unitPrice * line.qty)}
                </span>
              </div>
              <ul className="mt-2 text-sm text-muted">
                {line.options.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Доставка</dt>
            <dd>
              {delivery?.title}
              {order.deliveryPrice > 0
                ? ` — ${formatPrice(order.deliveryPrice)}`
                : ""}
            </dd>
          </div>
          {order.customer.address && (
            <div className="flex justify-between gap-6">
              <dt className="text-muted">Адрес</dt>
              <dd className="text-right">{order.customer.address}</dd>
            </div>
          )}
          <div className="mt-2 flex items-end justify-between border-t border-line pt-4">
            <dt className="label text-muted">Итого</dt>
            <dd className="display text-3xl">
              {order.approximate && <span className="text-muted">от&nbsp;</span>}
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/catalog"
            className="display rounded-full bg-forest px-8 py-4 text-cream transition-colors hover:bg-forest-lift"
          >
            Вернуться в каталог
          </Link>
          <a
            href={site.contacts.instagram}
            target="_blank"
            rel="noreferrer"
            className="display rounded-full border border-line px-8 py-4 transition-colors hover:border-gold hover:text-forest"
          >
            Написать нам
          </a>
        </div>

        <p className="mt-8 text-xs text-muted">
          Сохраните номер заказа {order.id} — по нему мы найдём вас быстрее
          всего.
        </p>
      </div>
    </section>
  );
}
