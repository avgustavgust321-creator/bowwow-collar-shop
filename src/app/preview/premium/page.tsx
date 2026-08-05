import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { ColorCycleHero } from "@/components/preview/ColorCycleHero";
import { LeatherSwatch } from "@/components/brand/LeatherSwatch";
import { VariantSwitch } from "@/components/preview/VariantSwitch";
import { selectableLeatherColors } from "@/content/leather";
import { formatPrice, priceFrom, products } from "@/lib/catalog";

/**
 * ВАРИАНТ Б — премиум в фирменных цветах.
 *
 * Строгая раскладка и антиква с высоким контрастом, но палитра своя:
 * тёмно-зелёный фон открыток, изумруд на ссылках и наведении, розовый
 * на подчёркиваниях. Иллюстрации приходят сюда точечно — собакой за
 * курсором и рисунками на отдельных блоках, а не сплошным полем.
 */
const serif = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-preview-serif",
});

const sans = Jost({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400"],
  variable: "--font-preview-sans",
});

export default function PremiumPreview() {
  const featured = products.filter((p) => p.images.length > 0).slice(0, 3);

  return (
    <div
      className={`${serif.variable} ${sans.variable} bg-[#06301E] text-[#F1EAE0]`}
      style={{ fontFamily: "var(--font-preview-sans)" }}
    >
      <VariantSwitch />

      <ColorCycleHero />

      {/* ТОВАРЫ */}
      <section className="px-6 py-24 md:px-16">
        <div className="flex items-baseline justify-between">
          <h2
            className="text-3xl font-light md:text-4xl"
            style={{ fontFamily: "var(--font-preview-serif)" }}
          >
            Избранное
          </h2>
          <Link
            href="/catalog"
            className="text-[0.7rem] tracking-[0.28em] text-[#9FBBA8] uppercase"
          >
            Весь каталог
          </Link>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {featured.map((product) => {
            const price = priceFrom(product);
            return (
              <Link key={product.slug} href={`/product/${product.slug}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </div>
                <h3
                  className="mt-6 text-2xl font-light"
                  style={{ fontFamily: "var(--font-preview-serif)" }}
                >
                  {product.title}
                </h3>
                <p className="mt-2 text-sm font-light text-[#9FBBA8]">
                  {price.from && "от "}
                  {formatPrice(price.value)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ПАЛИТРА */}
      <section className="border-t border-[#17A06A]/25 px-6 py-24 md:px-16">
        <p className="text-[0.7rem] tracking-[0.34em] text-[#9FBBA8] uppercase">
          Палитра
        </p>
        <h2
          className="mt-6 max-w-xl text-3xl leading-tight font-light md:text-5xl"
          style={{ fontFamily: "var(--font-preview-serif)" }}
        >
          Двенадцать оттенков натуральной кожи
        </h2>

        <div className="mt-16 grid grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-6">
          {selectableLeatherColors.map((color) => (
            <div key={color.id}>
              <LeatherSwatch color={color} className="aspect-square w-full" />
              <p className="mt-3 text-[0.68rem] tracking-[0.22em] text-[#9FBBA8] uppercase">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-28" />
    </div>
  );
}
