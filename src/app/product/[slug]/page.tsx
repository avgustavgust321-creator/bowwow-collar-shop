import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomArchive } from "@/components/product/CustomArchive";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductView } from "@/components/product/ProductView";
import { categoryById } from "@/content/categories";
import { site } from "@/content/site";
import { colorOf, selectableColors } from "@/lib/palette";
import {
  formatPrice,
  getProduct,
  priceFrom,
  listedProducts,
  mainSlot,
  productionTerm,
  products,
} from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.summary,
    openGraph: { title: product.title, description: product.summary },
    // Черновик с ценой-заглушкой поисковикам не показываем
    ...(product.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categoryById.get(product.category);
  const price = priceFrom(product);
  // Кожаное изделие или печатное — от этого зависят материал, число
  // цветов, ссылка на уход и обещание перешить по размеру
  const leather = (mainSlot(product)?.palette ?? "leather") === "leather";
  const slot = mainSlot(product);
  const colorCount = selectableColors(slot?.palette).length;
  // Что писать в строке «Цвета»: число вариантов, единственный цвет
  // модели или ничего, если цвет пока не выбирается на сайте
  const colorsText = product.viaInstagram
    ? "Любые — обсудим"
    : !slot
      ? null
      : slot.fixed
        ? (colorOf(slot.palette, slot.defaultColor)?.name ?? null)
        : `${colorCount} вариантов`;
  const related = listedProducts
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 4);

  // Микроразметка для поиска: цена «от» и наличие
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.summary,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: site.currency,
      lowPrice: price.value,
      availability: "https://schema.org/MadeToOrder",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Навигационная цепочка"
        className="wrap label flex flex-wrap items-center gap-x-2 border-b border-line px-5 py-1 text-muted md:px-10"
      >
        <Link
          href="/catalog"
          className="inline-flex min-h-11 items-center hover:text-forest"
        >
          Каталог
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?category=${product.category}`}
          className="inline-flex min-h-11 items-center hover:text-forest"
        >
          {category?.title}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <ProductView product={product} />

      {/* Описание и характеристики */}
      <section className="relative border-t border-line">
        <div className="wrap relative grid gap-10 px-5 py-16 md:px-10 lg:grid-cols-2">
          <div>
            <h2 className="label text-muted">Об изделии</h2>
            <div className="mt-5 flex max-w-prose flex-col gap-4 text-muted">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {product.sizes && (
              <div>
                <h2 className="label text-muted">Размеры и цены</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-80 border-collapse text-left">
                    <thead>
                      <tr className="border-b border-line">
                        <th className="label py-2">Размер</th>
                        <th className="label py-2">Параметры</th>
                        <th className="label py-2 text-right">Цена</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizes.map((size) => (
                        <tr key={size.code} className="border-b border-line">
                          <td className="py-3 font-semibold">{size.code}</td>
                          <td className="py-3 text-muted">
                            {size.note ?? "—"}
                          </td>
                          <td className="py-3 text-right">
                            {product.draft ? (
                              <span className="text-muted">скоро</span>
                            ) : (
                              <>
                                {size.from && (
                                  <span className="text-muted">от </span>
                                )}
                                {formatPrice(size.price)}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {product.customFit && (
                  <p className="mt-4 text-sm text-muted">
                    Не подходит ни один размер?{" "}
                    <Link
                      href="/sizing"
                      className="underline hover:text-forest"
                    >
                      Снимите замеры
                    </Link>{" "}
                    — сошьём по фигуре питомца.
                  </p>
                )}

                {/* Обещание про переделку стоит прямо под сеткой: сомнение
                    «а если промахнусь с размером» возникает именно здесь,
                    а не на странице доставки, куда за ним никто не пойдёт. */}
                {leather && (
                  <p className="mt-3 border-l-2 border-gold pl-4 text-sm text-muted">
                    Ошиблись с размером — сошьём заново бесплатно, оплатите
                    только пересылку.{" "}
                    <Link
                      href="/delivery"
                      className="underline hover:text-forest"
                    >
                      Подробнее
                    </Link>
                  </p>
                )}
              </div>
            )}

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm">
              <div>
                <dt className="label text-muted">Материал</dt>
                <dd className="mt-1">
                  {product.viaInstagram
                    ? "Итальянская кожа, замша"
                    : leather
                      ? "Итальянская кожа"
                      : "Пластик, 3D-печать; чаша — нержавеющая сталь"}
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Изготовление</dt>
                <dd className="mt-1">{productionTerm(product)}</dd>
              </div>
              {colorsText && (
                <div>
                  <dt className="label text-muted">
                    {slot?.fixed
                      ? "Цвет кожи"
                      : leather
                        ? "Цвета кожи"
                        : "Цвета"}
                  </dt>
                  <dd className="mt-1">{colorsText}</dd>
                </div>
              )}
              {leather && (
                <div>
                  <dt className="label text-muted">Уход</dt>
                  <dd className="mt-1">
                    <Link
                      href="/care"
                      className="inline-flex min-h-11 items-center underline hover:text-forest"
                    >
                      Как ухаживать
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      {product.viaInstagram && (
        <section className="border-t border-line px-5 py-16 md:px-10 md:py-24">
          <div className="wrap">
            <p className="hand -rotate-3 text-3xl text-gold-ink md:text-4xl">
              архив мастерской
            </p>
            <h2 className="display-xl mt-1 text-ink">
              Сделано <em className="text-gold-ink">однажды</em>
            </h2>
            <p className="mt-5 max-w-xl text-muted">
              Ошейники, которые мы уже шили по индивидуальным заказам. С них
              удобно начать разговор о вашем.
            </p>
            <CustomArchive className="mt-12" />

            <ol className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3">
              {[
                ["Референс", `Пришлите в инстаграм ${site.contacts.instagramHandle} фото ошейника, который нравится, или опишите идею словами.`],
                ["Обсуждение", "В переписке уточним материал, цвета, размер и назовём точную цену. До этого платить ничего не нужно."],
                ["Шьём", `Раскрой, строчка, ручная доводка — ${productionTerm(product)}. Потом отправляем европочтой или курьером по Бресту.`],
              ].map(([title, text], i) => (
                <li key={title} className="bg-cream p-6 md:p-8">
                  <p className="display text-5xl text-gold-ink">{i + 1}</p>
                  <p className="label mt-4 text-ink">{title}</p>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap px-5 pb-8 md:px-10">
          <h2 className="display py-8 text-2xl">Из этой же категории</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
