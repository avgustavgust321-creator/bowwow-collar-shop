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
        <h2 className="display mt-6 text-2xl">Если размер не подошёл</h2>
        <p>
          Сошьём заново бесплатно. Изделие делается под конкретную собаку, и
          промах по размеру — наша забота, а не ваша: новую вещь по уточнённым
          меркам вы не оплачиваете.
        </p>
        <p>
          Пересылку оплачивает заказчик — и когда отправляет вещь обратно, и
          когда мы высылаем новую.
        </p>
        <p>
          Оговорка одна, и она про здравый смысл: бесплатная переделка не
          распространяется на случаи, когда заказан заведомо не тот размер —
          например, ошейник на 25 см при обхвате шеи 50 см. Если сомневаетесь
          между двумя размерами, напишите нам до заказа: подскажем, какой
          брать.
        </p>
        {/* ЗАПОЛНИТЬ: формальные условия возврата — в оферту. Изделия по
            индивидуальным меркам по законодательству РБ возврату и обмену
            надлежащего качества не подлежат, и это стоит проговорить там
            отдельно. Здесь намеренно написано простыми словами: это не
            юридический текст, а обещание мастерской. */}
      </Prose>
    </>
  );
}
