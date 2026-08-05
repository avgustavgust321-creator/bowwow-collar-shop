import Link from "next/link";
import { LeatherSwatch } from "@/components/brand/LeatherSwatch";
import { ScrollHero } from "@/components/hero/ScrollHero";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { categories } from "@/content/categories";
import { selectableLeatherColors } from "@/content/leather";
import { site } from "@/content/site";
import { products } from "@/lib/catalog";

/** Порядок здесь настоящий: пока не сняты мерки, шить нечего. */
const steps = [
  {
    title: "Снимаете четыре мерки",
    text: "Обхват груди, длина спинки, обхват шеи, длина грудки. Инструкция с картинками — на отдельной странице.",
    href: "/sizing",
    link: "Как замерить",
  },
  {
    title: "Собираете изделие",
    text: "Цвет кожи, цвет подклада, фурнитура и имя питомца на бирке. Цена пересчитывается сразу.",
    href: "/catalog",
    link: "В каталог",
  },
  {
    title: "Мы шьём и отправляем",
    text: "Каждая вещь шьётся под конкретную собаку и уезжает по Беларуси.",
    href: "/delivery",
    link: "Доставка",
  },
];

const claims = [
  "Ручная работа",
  "Натуральная кожа",
  "Размеры по замерам",
  "Латунь",
];

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <>
      <ScrollHero />

      {/* Тихая строка фактов вместо бегущей ленты */}
      <div className="border-y border-line">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {claims.map((claim) => (
            <li key={claim} className="label px-5 py-5 text-center text-muted">
              {claim}
            </li>
          ))}
        </ul>
      </div>

      {/* ЧТО ШЬЁМ */}
      <section className="px-5 py-20 md:px-10">
        <p className="label text-brass">Ассортимент</p>
        <h2 className="display mt-5 text-4xl md:text-5xl">Что мы шьём</h2>

        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Reveal key={category.id} delay={i * 60} className="h-full">
              <Link
                href={`/catalog?category=${category.id}`}
                className="group block h-full bg-night p-7 transition-colors hover:bg-forest"
              >
                <h3 className="display text-2xl transition-colors group-hover:text-brass">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm text-muted">
                  {category.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ИЗБРАННОЕ */}
      <section className="px-5 pb-20 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-10">
          <h2 className="display text-4xl md:text-5xl">Избранное</h2>
          <Link
            href="/catalog"
            className="label border-b border-brass pb-1 transition-colors hover:border-emerald hover:text-emerald"
          >
            Весь каталог
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.slug} delay={i * 60} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ПАЛИТРА — настоящее зерно кожи, не заливка */}
      <section className="border-t border-line bg-forest px-5 py-20 md:px-10">
        <p className="label text-brass">Палитра</p>
        <h2 className="display mt-5 max-w-2xl text-4xl md:text-5xl">
          Двенадцать оттенков, у каждого своё имя
        </h2>

        <div className="mt-14 grid grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-6">
          {selectableLeatherColors.map((color) => (
            <div key={color.id}>
              <LeatherSwatch color={color} className="aspect-square w-full" />
              <p className="label mt-3 text-muted">{color.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ — нумерация оправдана: это последовательность */}
      <section className="px-5 py-20 md:px-10">
        <p className="label text-brass">Порядок работы</p>
        <h2 className="display mt-5 text-4xl md:text-5xl">Как это работает</h2>

        <ol className="mt-12 grid gap-px bg-line md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80} className="contents">
              <li className="bg-night p-7">
                <span className="label text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-4 text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm text-muted">{step.text}</p>
                <Link
                  href={step.href}
                  className="label mt-6 inline-block border-b border-line pb-1 transition-colors hover:border-brass hover:text-brass"
                >
                  {step.link}
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-20 flex flex-col items-center border-t border-line pt-16 text-center">
          <h2 className="display max-w-xl text-3xl md:text-4xl">
            Соберите ошейник под свою собаку
          </h2>
          <Link
            href="/catalog"
            className="label mt-8 inline-flex min-h-11 items-center bg-brass px-8 text-night transition-colors hover:bg-brass-light"
          >
            Смотреть каталог
          </Link>
          <a
            href={site.contacts.instagram}
            target="_blank"
            rel="noreferrer"
            className="label mt-6 text-muted transition-colors hover:text-emerald"
          >
            или напишите нам — {site.contacts.instagramHandle}
          </a>
        </div>
      </section>
    </>
  );
}
