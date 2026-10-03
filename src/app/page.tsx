import Image from "next/image";
import Link from "next/link";
import { Seal } from "@/components/brand/Seal";
import { ScrollHero } from "@/components/hero/ScrollHero";
import { Community } from "@/components/home/Community";
import { Workshop } from "@/components/home/Workshop";
import { LeatherDeck } from "@/components/home/LeatherDeck";
import { Reveal } from "@/components/ui/Reveal";
import { archivePieces } from "@/content/custom-archive";
import { site } from "@/content/site";
import { formatPrice, priceFrom, products } from "@/lib/catalog";
import type { Product } from "@/lib/product-schema";

/**
 * Главная.
 *
 * Первая версия была честной, но плоской: одни заливки и тонкие линии,
 * всё в одной плоскости. Здесь у страницы появился материал и орнамент —
 * из референсов самого бренда: полоски маркизы, круглая печать, золотые
 * рамки-паспарту, розовые секции, фактура бумаги и кожи. Заголовки стали
 * крупнее и с курсивным акцентом, модели — карточками со своей тенью.
 *
 * Первый экран не трогаем — он живёт отдельно, в ScrollHero.
 */

/** Проверяемые факты, а не общие слова про качество. */
const facts = [
  "итальянская кожа 3,5 мм",
  "12 цветов со своими именами",
  "размер по вашим меркам",
  "литая латунь",
  "гравировка на ремне",
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
    text: "Цвет кожи, цвет подклада, фурнитура и имя питомца на ремне. Цена пересчитывается сразу, без ожидания ответа в директе.",
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

/** Звёздочка-разделитель из референса Pin-Up Beauty — рисунком, не символом */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      <path
        d="M10 0c.6 5.6 4.4 9.4 10 10-5.6.6-9.4 4.4-10 10-.6-5.6-4.4-9.4-10-10C5.6 9.4 9.4 5.6 10 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Круглый ценник, чуть повёрнутый — как бирка на шнурке */
function PriceTag({ product, className }: { product: Product; className?: string }) {
  const price = priceFrom(product);
  return (
    <span
      className={
        "absolute z-10 flex size-24 -rotate-8 flex-col items-center justify-center rounded-full bg-rose text-forest shadow-card md:size-28 " +
        (className ?? "")
      }
    >
      {price.from && <span className="label">от</span>}
      <span className="display text-2xl leading-none md:text-3xl">
        {formatPrice(price.value).replace(" р.", "")}
      </span>
      <span className="label">р.</span>
    </span>
  );
}

export default function HomePage() {
  const lined = products.find((p) => p.slug === "collar-lined");
  const solid = products.find((p) => p.slug === "collar-solid");
  const custom = products.find((p) => p.slug === "collar-custom");

  return (
    <>
      {/*
        Заголовок страницы. Видимого H1 на главной быть не может: первый
        экран — это видео, а его подписи меняются по ходу сцены и на роль
        заголовка не годятся. Поэтому H1 есть в разметке, но скрыт от
        глаза — поисковику и скринридеру он нужен, макету мешает.
      */}
      <h1 className="sr-only">
        {site.name} — {site.tagline}: ошейники, шлейки и поводки из
        итальянской кожи на заказ, {site.city}
      </h1>

      <ScrollHero />

      {/* ЛЕНТА ФАКТОВ — розовая, как маркиза над витриной */}
      <section aria-label="Коротко об ошейниках" className="bg-rose text-forest">
        <div aria-hidden className="stripes-forest h-2.5" />
        <ul className="wrap flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-6 md:px-10">
          {facts.map((fact, i) => (
            // Разделитель стоит после факта: при переносе строки звёздочка
            // остаётся в конце, а не повисает в начале следующей
            <li
              key={fact}
              className="display flex items-center gap-x-5 text-lg whitespace-nowrap italic md:text-xl"
            >
              {fact}
              {i < facts.length - 1 && <Sparkle className="size-3 text-forest" />}
            </li>
          ))}
        </ul>
      </section>

      {/* ДВЕ МОДЕЛИ — карточки со своей тенью и ступенькой, печать на стыке */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="wrap">
          <p className="hand -rotate-3 text-3xl text-gold-ink md:text-4xl">коллекция</p>
          <h2 className="display-xl mt-1 max-w-4xl text-ink">
            Два ошейника, <em className="text-gold-ink">двенадцать</em> оттенков
          </h2>
        </div>

        <div className="wrap relative mt-14 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          {/* Печать на стыке двух карточек — только на широком экране */}
          <Seal className="absolute top-[14%] left-[57.5%] z-20 hidden w-36 -translate-x-1/2 lg:block" />

          {lined && (
            <Reveal className="h-full">
              <Link
                href={`/product/${lined.slug}`}
                className="group block h-full bg-shell shadow-card transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="frame-gold relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/tovary/1-oshejniki/s-podkladom/tiffani.jpg"
                    alt="Ошейник с мятным подкладом на замше"
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="label absolute top-6 left-6 z-10 bg-forest px-3 py-1.5 text-cream">
                    Хит
                  </span>
                </div>
                <div className="relative p-7 md:p-10">
                  <PriceTag product={lined} className="-top-14 right-6 md:right-10" />
                  <p className="label text-muted">Двухцветные</p>
                  <h3 className="display mt-3 max-w-md text-4xl text-ink md:text-5xl">
                    С цветным <em className="text-gold-ink">подкладом</em>
                  </h3>
                  <p className="mt-4 max-w-md text-muted">{lined.summary}</p>
                  <p className="label mt-7 inline-flex items-center gap-3 text-forest">
                    Собрать свой
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          )}

          {solid && (
            <Reveal delay={80} className="h-full lg:mt-28">
              <Link
                href={`/product/${solid.slug}`}
                className="group flex h-full flex-col bg-shell shadow-card transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="frame-gold relative aspect-square overflow-hidden">
                  <Image
                    src="/images/tovary/1-oshejniki/odnotonnye/amster.jpg"
                    alt="Однотонный ошейник цвета «Амстер» на песке"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="relative flex flex-1 flex-col p-7 md:p-9">
                  <PriceTag product={solid} className="-top-14 right-6" />
                  <p className="label text-muted">Базовые</p>
                  <h3 className="display mt-3 text-3xl text-ink md:text-4xl">
                    <em className="text-gold-ink">Однотонный</em>
                  </h3>
                  <p className="mt-3 text-muted">{solid.summary}</p>
                  <p className="label mt-auto inline-flex items-center gap-3 pt-7 text-forest">
                    Собрать свой
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          )}
        </div>

        {/* ТРЕТИЙ ПУТЬ — ошейник по идее покупателя. Три заказных снимка
            веером: видно, что «на заказ» — это не абстракция, а уже сшитые вещи */}
        {custom && (
          <Reveal className="wrap mt-14">
            <Link
              href={`/product/${custom.slug}`}
              className="group grid items-center gap-10 overflow-hidden bg-forest p-7 text-cream shadow-card md:grid-cols-[1fr_1.1fr] md:p-12"
            >
              <div>
                <p className="hand -rotate-3 text-3xl text-gold-light md:text-4xl">
                  не нашли свой?
                </p>
                <h3 className="display mt-2 text-4xl md:text-5xl">
                  Сошьём по <em className="text-rose">вашей идее</em>
                </h3>
                <p className="mt-4 max-w-md text-cream-muted">
                  Замша, два цвета, фигурные вставки, клетка, тиснение имени —
                  в одном экземпляре. Пришлите фото-референс в инстаграм —
                  обсудим детали и назовём цену.
                </p>
                <p className="label mt-7 inline-flex items-center gap-3 text-rose">
                  Как заказать
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </p>
              </div>
              <div aria-hidden className="relative mx-auto h-64 w-full max-w-md md:h-80">
                {archivePieces.slice(0, 3).map((piece, i) => (
                  <div
                    key={piece.src}
                    className={[
                      "absolute top-1/2 w-[42%] bg-cream p-1.5 pb-5 shadow-card transition-transform duration-500",
                      ["left-0 -translate-y-1/2 -rotate-6 group-hover:-rotate-9", "left-[29%] z-10 -translate-y-[55%] rotate-1 group-hover:-translate-y-[60%]", "right-0 -translate-y-1/2 rotate-6 group-hover:rotate-9"][i],
                    ].join(" ")}
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={piece.src}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 18vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          </Reveal>
        )}

        <div className="wrap mt-12 flex justify-center">
          <Link
            href="/catalog"
            className="label inline-flex min-h-12 items-center gap-3 border border-forest px-8 text-forest transition-colors hover:bg-forest hover:text-cream"
          >
            Весь каталог: шлейки, поводки, миски
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* МАТЕРИАЛ — макрокадр во всю ширину, врезка с фактурой кожи */}
      <section className="relative">
        <div className="relative aspect-[4/3] md:aspect-[21/9]">
          <Image
            src="/images/sajt/progulki/shot-6.jpg"
            alt="Латунный карабин и кожаный подклад крупным планом"
            fill
            sizes="100vw"
            className="object-cover object-[35%_center] md:object-center"
          />
        </div>

        <div className="leather-texture bg-forest px-5 py-12 text-cream on-dark md:absolute md:right-10 md:bottom-10 md:max-w-md md:px-10 md:py-11 md:shadow-card">
          <div aria-hidden className="pointer-events-none absolute inset-3 hidden border border-gold/50 md:block" />
          <p className="hand -rotate-2 text-3xl text-rose">из чего сделано</p>
          <h2 className="display mt-2 text-4xl md:text-5xl">
            Кожа и <em className="text-rose">литая</em> латунь
          </h2>
          <p className="mt-5 text-cream-muted">
            Итальянская кожа: основная — 3,5 мм, подклад — от 2 до 2,4 мм.
            Такая толщина держит форму и не складывается вдвое под нагрузкой.
          </p>
          <p className="mt-4 text-cream-muted">
            Фурнитура литая — латунная или серебряного цвета. Латунь со
            временем темнеет, но не облезает. Длинные швы прострачиваются на машинке,
            узлы у пряжки и колец прошиваются иглой.
          </p>
        </div>
      </section>

      {/* ПАЛИТРА — веер образцов во всю ширину, подписной элемент страницы */}
      <section className="leather-texture bg-forest pt-20 pb-16 text-cream on-dark md:pt-28">
        <div className="wrap px-5 md:px-10">
          <p className="hand -rotate-3 text-3xl text-rose md:text-4xl">палитра</p>
          <h2 className="display-xl mt-1 max-w-4xl">
            Двенадцать оттенков, у каждого <em className="text-rose">своё имя</em>
          </h2>
          <p className="mt-6 max-w-md text-cream-muted">
            Имена придуманы в мастерской и прижились — клиенты так и заказывают:
            «однотонный Слизерин» или «подклад Тиффани».
          </p>
        </div>

        <div className="mt-14">
          <LeatherDeck />
        </div>
      </section>

      {/* ПОРЯДОК РАБОТЫ — на розовом, под полосатой маркизой.
          Нумерация честная: это настоящая последовательность. */}
      <section className="bg-rose text-forest">
        <div aria-hidden className="stripes-forest h-3" />
        <div className="wrap px-5 py-20 md:px-10 md:py-28">
          <p className="hand -rotate-3 text-3xl md:text-4xl">три шага</p>
          <h2 className="display-xl mt-1 max-w-3xl">
            Как собирается <em>заказ</em>
          </h2>

          <ol className="mt-14">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 70} className="contents">
                <li className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-forest/25 py-9 md:grid-cols-[9rem_1fr_11rem] md:gap-x-10 md:py-11">
                  <span
                    aria-hidden
                    className="display text-6xl leading-none italic md:text-8xl"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="display text-3xl md:text-4xl">{step.title}</h3>
                    <p className="mt-3 max-w-xl text-forest/85">{step.text}</p>
                  </div>
                  <Link
                    href={step.href}
                    className="label col-start-2 mt-5 inline-flex min-h-11 items-center gap-2 self-start justify-self-start border-b border-forest/40 transition-colors hover:border-forest md:col-start-3 md:mt-2 md:justify-self-end"
                  >
                    {step.link} <span aria-hidden>→</span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Workshop />

      <Community />

      {/* ФИНАЛ — портрет во всю высоту, печать на стыке с зелёной панелью.
          -mb-20 гасит отступ подвала: здесь зелёная панель переходит в
          подвал без кремовой щели, а на остальных страницах отступ нужен. */}
      <section className="relative -mb-20 grid md:grid-cols-2">
        <div className="relative min-h-[64vh]">
          <Image
            src="/images/sajt/progulki/shot-8.jpg"
            alt="Далматин в широком ошейнике с розовым подкладом"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <Seal
          ring="var(--color-rose)"
          ink="var(--color-forest)"
          accent="var(--color-forest)"
          className="absolute top-1/2 left-1/2 z-10 hidden w-40 -translate-x-1/2 -translate-y-1/2 md:block"
        />

        <div className="leather-texture flex flex-col justify-center bg-forest px-5 py-20 text-cream on-dark md:px-16">
          <p className="hand -rotate-3 text-3xl text-rose md:text-4xl">мастерская в Бресте</p>
          <h2 className="display-xl mt-1">
            Соберите под <em className="text-rose">свою</em> собаку
          </h2>
          <p className="mt-6 max-w-md text-cream-muted">
            Не подбираете из готового, а собираете: размер по вашим меркам, свой
            цвет кожи, своя фурнитура, имя на ремне.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/catalog"
              className="label inline-flex min-h-12 items-center gap-3 bg-rose px-9 text-forest shadow-[0_14px_30px_-14px_rgba(244,194,194,0.55)] transition hover:-translate-y-0.5 hover:bg-rose-deep"
            >
              Смотреть каталог <span aria-hidden>→</span>
            </Link>
            <a
              href={site.contacts.instagram}
              target="_blank"
              rel="noreferrer"
              className="label inline-flex min-h-11 items-center border-b border-line-dark text-cream-muted transition-colors hover:border-rose hover:text-cream"
            >
              {site.contacts.instagramHandle}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
