import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/ui/Page";
import { deliveryOptions } from "@/content/delivery";
import { formatPrice } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description:
    "Способы доставки по Беларуси и порядок оплаты заказа BOW WOW COLLAR.",
};

export default function DeliveryPage() {
  return (
    <>
      <PageHeader
        title="Доставка"
        lead="Изделия шьются под заказ, поэтому отсчёт срока доставки начинается после того, как вещь готова."
      />

      <section className="px-5 py-14 md:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="label text-muted">Способы доставки</h2>
          <ul className="mt-5 flex flex-col border-t border-line">
            {deliveryOptions.map((option) => (
              <li
                key={option.id}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-5"
              >
                <div>
                  <p className="display text-lg">{option.title}</p>
                  <p className="mt-1 text-sm text-muted">{option.hint}</p>
                </div>
                <p className="whitespace-nowrap">
                  {option.price > 0 ? formatPrice(option.price) : "бесплатно"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Prose>
        <h2 className="display text-2xl">Оплата</h2>
        <p>
          Заказ можно оплатить картой на сайте. Если в заказе есть изделие по
          индивидуальным замерам, сначала мастер проверяет мерки и подтверждает
          окончательную стоимость — только после этого приходит ссылка на
          оплату.
        </p>
        <h2 className="display mt-6 text-2xl">Сроки изготовления</h2>
        <p>
          Срок указан на странице каждого изделия и отсчитывается с момента
          подтверждения заказа. В сезон (перед праздниками) срок может
          увеличиться — мы предупредим заранее.
        </p>
        <h2 className="display mt-6 text-2xl">Возврат и обмен</h2>
        <p>
          {/* ЗАПОЛНИТЬ: изделия по индивидуальным меркам по законодательству
              РБ обмену и возврату надлежащего качества не подлежат — уточните
              формулировку и пропишите условия обмена по размеру. */}
          ЗАПОЛНИТЬ: условия возврата и обмена. Обязательно опишите отдельно
          изделия, сшитые по индивидуальным меркам, и изделия стандартных
          размеров.
        </p>
      </Prose>
    </>
  );
}
