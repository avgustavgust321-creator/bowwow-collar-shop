import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/ui/Page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Публичная оферта",
  robots: { index: false },
};

/**
 * ⚠ ЮРИДИЧЕСКИЙ ДОКУМЕНТ — ЗАПОЛНИТЬ.
 *
 * Здесь намеренно нет готового текста: оферта должна соответствовать
 * законодательству Республики Беларусь и вашей реальной схеме работы.
 * Возьмите шаблон у юриста или в вашем банке-эквайере (bePaid выдаёт
 * требования к обязательным разделам) и вставьте текст в разделы ниже.
 *
 * Обязательный минимум для интернет-магазина в РБ:
 *  • полные реквизиты продавца (ИП/УНП, адрес, контакты);
 *  • сведения о регистрации в Торговом реестре РБ;
 *  • предмет договора, порядок оформления и оплаты заказа;
 *  • сроки изготовления и доставки;
 *  • порядок возврата, включая оговорку про изделия по индивидуальным меркам;
 *  • порядок разрешения споров.
 */
export default function OfferPage() {
  return (
    <>
      <PageHeader title="Оферта" />
      <Prose>
        <p className="border-l-2 border-brass bg-forest px-4 py-3 text-sm">
          Страница ожидает юридический текст. Реквизиты подтягиваются из файла
          настроек сайта.
        </p>

        <h2 className="display text-2xl">1. Продавец</h2>
        <p>
          {site.legal.entity}, УНП {site.legal.unp}. {site.legal.address}
          <br />
          {site.legal.registry}
          <br />
          {site.contacts.phone} · {site.contacts.email}
        </p>

        <h2 className="display mt-4 text-2xl">2. Предмет договора</h2>
        <p>ЗАПОЛНИТЬ.</p>

        <h2 className="display mt-4 text-2xl">3. Оформление и оплата заказа</h2>
        <p>ЗАПОЛНИТЬ.</p>

        <h2 className="display mt-4 text-2xl">4. Сроки изготовления и доставка</h2>
        <p>ЗАПОЛНИТЬ.</p>

        <h2 className="display mt-4 text-2xl">5. Возврат и обмен</h2>
        <p>
          ЗАПОЛНИТЬ. Отдельно опишите изделия, изготовленные по индивидуальным
          меркам.
        </p>

        <h2 className="display mt-4 text-2xl">6. Разрешение споров</h2>
        <p>ЗАПОЛНИТЬ.</p>
      </Prose>
    </>
  );
}
