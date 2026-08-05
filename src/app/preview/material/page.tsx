import Image from "next/image";
import Link from "next/link";
import { LeatherSwatch } from "@/components/brand/LeatherSwatch";
import { VariantSwitch } from "@/components/preview/VariantSwitch";
import { categories } from "@/content/categories";
import { selectableLeatherColors } from "@/content/leather";
import { formatPrice, priceFrom, products } from "@/lib/catalog";
import dogLine from "../../../../public/images/brand/dog-line.png";

/**
 * ВАРИАНТ А — материальная мастерская.
 *
 * Характер бренда остаётся: маркерный шрифт, рисунок, розовый и оливковый.
 * Но главными становятся фотографии кожи, у карточек появляется вес,
 * а образцы цветов показываются настоящим зерном, а не заливкой.
 */
export default function MaterialPreview() {
  const featured = products.filter((p) => p.images.length > 0).slice(0, 3);

  return (
    <div className="bg-paper">
      <VariantSwitch />

      {/* ГЕРОЙ: во весь экран — товар, а не плашка с текстом */}
      <section className="relative min-h-[86vh] overflow-hidden">
        <Image
          src="/images/photos/walk-dalmatian.jpg"
          alt="Далматин в розовом кожаном ошейнике на прогулке"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Затемнение снизу — чтобы текст читался поверх фотографии */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,26,18,0.78) 0%, rgba(20,26,18,0.25) 45%, transparent 72%)",
          }}
        />

        <div className="relative flex min-h-[86vh] flex-col justify-end px-5 pb-14 md:px-10">
          <p className="hand text-3xl text-bubblegum">Минск, шьём с 2019</p>
          <h1 className="display mt-2 max-w-4xl text-5xl text-paper md:text-7xl">
            Кожа, латунь
            <br />
            и ваши замеры
          </h1>
          <p className="mt-5 max-w-lg text-lg text-paper/85">
            Ошейники, шлейки и поводки ручной работы. Двенадцать цветов кожи,
            латунная фурнитура, размеры по вашей собаке.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="display rounded-full bg-paper px-8 py-4 text-xl text-forest transition-colors hover:bg-bubblegum"
            >
              Выбрать ошейник
            </Link>
            <Link
              href="/sizing"
              className="display rounded-full border-2 border-paper/70 px-8 py-4 text-xl text-paper transition-colors hover:bg-paper/10"
            >
              Как замерить
            </Link>
          </div>
        </div>
      </section>

      {/* ТОВАРЫ: фотография занимает больше места, чем текст */}
      <section className="px-5 py-16 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="display text-4xl md:text-5xl">Забирают чаще всего</h2>
          <Link
            href="/catalog"
            className="hand text-2xl text-olive underline decoration-2 underline-offset-4"
          >
            весь каталог →
          </Link>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {featured.map((product) => {
            const price = priceFrom(product);
            return (
              <Link key={product.slug} href={`/product/${product.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(20,26,18,0.55)]">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="display mt-4 text-2xl">{product.title}</h3>
                <p className="mt-1 text-ink/65">{product.summary}</p>
                <p className="hand mt-2 text-3xl text-olive">
                  {price.from && "от "}
                  {formatPrice(price.value)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ПАЛИТРА: настоящее зерно кожи вместо плоских кружков */}
      <section className="bg-forest px-5 py-16 text-paper md:px-10">
        <p className="hand text-3xl text-bubblegum">у каждого цвета своё имя</p>
        <h2 className="display mt-2 max-w-3xl text-4xl md:text-6xl">
          Двенадцать цветов кожи
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {selectableLeatherColors.map((color) => (
            <div key={color.id}>
              <LeatherSwatch
                color={color}
                className="aspect-square w-full shadow-[0_10px_26px_-12px_rgba(0,0,0,0.7)]"
              />
              <p className="hand mt-2 text-center text-xl text-paper/85">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* КАТЕГОРИИ + рисунок как приписка на полях */}
      <section className="relative px-5 py-16 md:px-10">
        <Image
          src={dogLine}
          alt=""
          aria-hidden
          sizes="360px"
          className="pointer-events-none absolute right-4 -bottom-2 w-56 opacity-25 md:w-80"
        />
        <h2 className="display text-4xl md:text-5xl">Что мы шьём</h2>
        <div className="relative mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?category=${category.id}`}
              className="block h-full rounded-2xl bg-paper-deep p-6 shadow-[0_10px_28px_-16px_rgba(20,26,18,0.5)] transition-shadow hover:shadow-[0_18px_40px_-16px_rgba(20,26,18,0.55)]"
            >
              <h3 className="display text-2xl">{category.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}
