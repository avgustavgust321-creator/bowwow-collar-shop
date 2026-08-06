import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Page";

export const metadata: Metadata = {
  title: "Частые вопросы",
  description:
    "Ответы на частые вопросы о кожаных ошейниках, шлейках и поводках BOW WOW COLLAR.",
};

/** ЗАПОЛНИТЬ: добавьте вопросы, которые чаще всего приходят в директ. */
const faq = [
  {
    q: "Чем поводок лучше рулетки?",
    a: "Поводок держит постоянную длину, и собака всегда понимает границу. Рулетка приучает тянуть: чем сильнее натяжение, тем длиннее становится поводок. Плюс механизм рулетки заедает в самый неподходящий момент, а кожаный поводок ломаться нечему.",
  },
  {
    q: "Как выбрать размер, если питомец ещё растёт?",
    a: "Для щенка берите размер по текущим меркам — ошейник на вырост натирает и съезжает. Когда собака подрастёт, можно заказать следующий размер, а первый останется как «домашний».",
  },
  {
    q: "Можно ли собрать ошейник и поводок в один цвет?",
    a: "Да, палитра кожи общая для всей линейки. Выберите один цвет в конфигураторе каждого изделия — и комплект будет собран.",
  },
  {
    q: "Что такое ошейник с цветным подкладом?",
    a: "Это двухслойное изделие: снаружи один цвет кожи, изнутри — другой. Подклад мягче и не натирает шерсть, а сочетание цветов вы выбираете сами.",
  },
  {
    q: "Сколько ждать заказ?",
    a: "Срок изготовления указан на странице каждого изделия. Отсчёт начинается после подтверждения заказа, доставка добавляется сверху.",
  },
  {
    q: "Кожа не сотрётся о шерсть?",
    a: "Наоборот: от носки кожа темнеет и полируется. Через полгода ошейник выглядит лучше, чем новый — это свойство натурального материала.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader title="Вопросы" />

      <section className="px-5 py-14 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col border-t border-line">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-line py-5">
              <summary className="display flex cursor-pointer list-none items-center justify-between gap-4 text-xl">
                {item.q}
                <span className="text-forest transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-muted">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-12 text-center text-muted">
          Не нашли ответ?{" "}
          <Link href="/sizing" className="underline hover:text-forest">
            Посмотрите, как снимать замеры
          </Link>{" "}
          или напишите нам в Instagram.
        </p>
      </section>
    </>
  );
}
