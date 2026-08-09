import Image from "next/image";
import Link from "next/link";
import { ScrollHero } from "@/components/hero/ScrollHero";
import { Community } from "@/components/home/Community";
import { LeatherDeck } from "@/components/home/LeatherDeck";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { formatPrice, priceFrom, products } from "@/lib/catalog";

/**
 * Главная.
 *
 * Раньше страница была пятью одинаковыми сетками карточек подряд — от этого
 * она и читалась как собранная по шаблону. Здесь у каждого блока свой ритм:
 * строка фактов, две модели разного размера, макрокадр материала, веер
 * образцов во всю ширину, шаги строками и портрет на всю высоту.
 *
 * Первый экран не трогаем — он живёт отдельно, в ScrollHero.
 */

/** Проверяемые факты из каталога, а не общие слова про качество. */
const facts = [
  "итальянская кожа 3,5 мм",
  "12 цветов",
  "размеры по сетке или по вашим замерам",
  "латунь или серебро",
  "гравировка до 14 знаков",
];

/** Порядок настоящий: пока не сняты мерки, шить нечего. */
const steps = [
  {
    title: "Снимаете мерки",
    text: "Обхват шеи — для ошейника, четыре мерки — для шлейки. На странице замеров показано, где прикладывать сантиметр.",
    href: "/sizing",
    link: "Как замерить",
  },
  {
    title: "Собираете изделие",
    text: "Цвет кожи, цвет подклада, фурнитура и имя питомца на бирке. Цена пересчитывается сразу, без ожидания ответа в директе.",
    href: "/catalog",
    link: "В каталог",
  },
  {
    title: "Шьём и отправляем",
    text: "Каждая вещь шьётся под конкретную собаку. Отправляем Европочтой по всей Беларуси, по Бресту привезёт курьер.",
    href: "/delivery",
    link: "Доставка",
  },
];

export default function HomePage() {
  const lined = products.find((p) => p.slug === "collar-lined");
  const solid = products.find((p) => p.slug === "collar-solid");

  return (
    <>
      <ScrollHero />

      {/* ФАКТЫ — одна тихая строка вместо четырёх плашек с общими словами */}
      <section className="border-b border-line px-5 py-8 md:px-10">
        <ul className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-muted">
          {facts.map((fact, i) => (
            <li key={fact} className="flex items-center gap-x-4">
              {i > 0 && (
                <span aria-hidden className="text-gold-ink">
                  ·
                </span>
              )}
              {fact}
            </li>
          ))}
        </ul>
      </section>

      {/* ДВЕ МОДЕЛИ — разного веса: хит крупно, базовая рядом */}
      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-px bg-line lg:grid-cols-[1.6fr_1fr]">
          {lined && (
            <Reveal className="h-full">
              <Link
                href={`/product/${lined.slug}`}
                className="group block h-full bg-cream"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/products/collar-lined/tiffani.jpg"
                    alt="Ошейник с мятным подкладом на замше"
                    fill
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7 md:p-9">
                  <p className="label text-muted">Двухцветные</p>
                  <h2 className="display mt-3 text-3xl md:text-5xl">
                    {lined.title}
                  </h2>
                  <p className="mt-4 max-w-md text-muted">{lined.summary}</p>
                  <p className="mt-5 text-lg">
                    {priceFrom(lined).from && (
                      <span className="text-muted">от </span>
                    )}
                    {formatPrice(priceFrom(lined).value)}
                  </p>
                </div>
              </Link>
            </Reveal>
          )}

          {solid && (
            <Reveal delay={80} className="h-full">
              <Link
                href={`/product/${solid.slug}`}
                className="group flex h-full flex-col bg-cream"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src="/images/products/collar-solid/amster.jpg"
                    alt="Однотонный ошейник цвета «Амстер» на песке"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="label text-muted">Базовые</p>
                  <h2 className="display mt-3 text-2xl md:text-3xl">
                    {solid.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted">{solid.summary}</p>
                  <p className="mt-auto pt-5 text-lg">
                    {priceFrom(solid).from && (
                      <span className="text-muted">от </span>
                    )}
                    {formatPrice(priceFrom(solid).value)}
                  </p>
                </div>
              </Link>
            </Reveal>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/catalog"
            className="label border-b border-gold pb-1 transition-colors hover:border-forest hover:text-forest"
          >
            Шлейки, поводки и аксессуары
          </Link>
        </div>
      </section>

      {/* МАТЕРИАЛ — макрокадр во всю ширину, текст врезкой поверх */}
      <section className="relative">
        <div className="relative aspect-[4/3] md:aspect-[21/9]">
          <Image
            src="/images/photos/shot-6.jpg"
            alt="Латунный карабин и кожаный подклад крупным планом"
            fill
            sizes="100vw"
            className="object-cover object-[35%_center] md:object-center"
          />
        </div>

        <div className="bg-forest px-5 py-12 text-cream md:absolute md:right-10 md:bottom-10 md:max-w-md md:px-9 md:py-10">
          <p className="hand text-rose">из чего сделано</p>
          <h2 className="display mt-3 text-3xl md:text-4xl">
            Кожа и литая латунь
          </h2>
          <p className="mt-4 text-cream-muted">
            Итальянская кожа: основная — 3,5 мм, подклад — от 2 до 2,4 мм.
            Такая толщина держит форму и не складывается вдвое под нагрузкой.
          </p>
          <p className="mt-4 text-cream-muted">
            Фурнитура — литая латунь или серебро, не покрытие: она темнеет от
            времени, но не облезает. Строчка по краю — вручную.
          </p>
        </div>
      </section>

      {/* ПАЛИТРА — веер образцов во всю ширину, подписной элемент страницы */}
      <section className="bg-forest pt-16 pb-16 text-cream md:pt-24">
        <div className="px-5 md:px-10">
          <p className="hand text-rose">палитра</p>
          <h2 className="display mt-3 max-w-2xl text-3xl md:text-5xl">
            Двенадцать оттенков, у каждого своё имя
          </h2>
          <p className="mt-4 max-w-md text-cream-muted">
            Имена придуманы в мастерской и прижились — клиенты так и заказывают:
            «Слизерин с подкладом Тиффани».
          </p>
        </div>

        <div className="mt-12">
          <LeatherDeck />
        </div>
      </section>

      {/* ПОРЯДОК РАБОТЫ — строками, а не тремя одинаковыми плашками.
          Нумерация здесь честная: это настоящая последовательность. */}
      <section className="px-5 py-16 md:px-10 md:py-24">
        <h2 className="display max-w-xl text-3xl md:text-5xl">
          Как собирается заказ
        </h2>

        <ol className="mt-12">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 70} className="contents">
              <li className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-line py-8 md:grid-cols-[6rem_1fr_10rem] md:gap-x-10 md:py-10">
                <span
                  aria-hidden
                  className="display text-4xl text-gold-ink md:text-6xl"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="display text-2xl md:text-3xl">{step.title}</h3>
                  <p className="mt-3 max-w-xl text-muted">{step.text}</p>
                </div>
                <Link
                  href={step.href}
                  className="label col-start-2 mt-5 self-start border-b border-line pb-1 transition-colors hover:border-gold hover:text-forest md:col-start-3 md:mt-2 md:justify-self-end"
                >
                  {step.link}
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <Community />

      {/* НА СОБАКЕ — портрет во всю высоту рядом с зелёной панелью */}
      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[60vh]">
          <Image
            src="/images/photos/shot-8.jpg"
            alt="Далматин в широком ошейнике с розовым подкладом"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center bg-forest px-5 py-16 text-cream on-dark md:px-12">
          <p className="hand text-rose">мастерская в Бресте</p>
          <h2 className="display mt-3 text-3xl md:text-5xl">
            Соберите под свою собаку
          </h2>
          <p className="mt-5 max-w-md text-cream-muted">
            Не подбираете из готового, а собираете: размер по вашим меркам, свой
            цвет кожи, своя фурнитура, имя на бирке.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/catalog"
              className="label inline-flex min-h-11 items-center bg-rose px-8 text-forest transition-colors hover:bg-rose-deep"
            >
              Смотреть каталог
            </Link>
            <a
              href={site.contacts.instagram}
              target="_blank"
              rel="noreferrer"
              className="label border-b border-line-dark pb-1 text-cream-muted transition-colors hover:border-rose hover:text-cream"
            >
              {site.contacts.instagramHandle}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
