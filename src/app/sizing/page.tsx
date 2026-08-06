import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/Page";
import { measurements } from "@/content/categories";

export const metadata: Metadata = {
  title: "Как замерить питомца",
  description:
    "Четыре замера, по которым шьётся ошейник и шлейка BOW WOW COLLAR: " +
    "обхват грудной клетки, длина спинки, обхват шеи и длина грудки.",
};

const steps = [
  {
    n: 1,
    ...measurements.chest,
    detail:
      "Оберните сантиметровую ленту вокруг груди в самом широком месте, отступив 1–4 пальца от подмышки. Лента должна лежать плотно, но не стягивать.",
  },
  {
    n: 2,
    ...measurements.backLength,
    detail:
      "Измерьте расстояние от холки до линии, по которой вы снимали обхват груди. Это длина спинки шлейки.",
  },
  {
    n: 3,
    ...measurements.neck,
    detail:
      "Обхват шеи снимается в самой широкой части, от холки. Для ошейника оставьте зазор в два пальца между лентой и шеей.",
  },
  {
    n: 4,
    ...measurements.chestPlate,
    detail:
      "От основания шеи до линии грудного обхвата — эта мерка отвечает за то, как сядет нагрудник.",
  },
];

export default function SizingPage() {
  return (
    <>
      <PageHeader
        title="Как замерить"
        lead="Четыре мерки, и изделие сядет по фигуре. Замеряйте питомца стоя, на спокойной собаке — не после прогулки и не во время игры."
      />

      <section className="px-5 py-14 md:px-8">
        <ol className="mx-auto flex max-w-3xl flex-col">
          {steps.map((step) => (
            <li
              key={step.id}
              className="grid gap-3 border-b border-line py-8 sm:grid-cols-[auto_1fr] sm:gap-8"
            >
              <span className="display text-5xl text-forest">{step.n}</span>
              <div>
                <h2 className="display text-2xl">{step.label}</h2>
                <p className="label mt-2 text-muted">{step.hint}</p>
                <p className="mt-3 text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 max-w-3xl border-l-2 border-gold bg-shell px-5 py-4">
          <p className="text-sm">
            Не уверены в замерах? Пришлите их нам в Instagram вместе с фото
            питомца — поможем выбрать размер. Ошибка в один сантиметр для
            ошейника некритична, а для шлейки важна.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/catalog"
            className="label inline-block bg-forest px-8 py-4 text-cream transition-colors hover:bg-forest-lift"
          >
            Выбрать изделие
          </Link>
        </div>
      </section>
    </>
  );
}
