import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductView } from "@/components/product/ProductView";
import { categoryById } from "@/content/categories";
import { site } from "@/content/site";
import { formatPrice, getProduct, priceFrom, products } from "@/lib/catalog";

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
  const related = products
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

      <nav className="label flex flex-wrap items-center gap-2 border-b border-line px-5 py-4 text-muted md:px-8">
        <Link href="/catalog" className="hover:text-brass">
          Каталог
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?category=${product.category}`}
          className="hover:text-brass"
        >
          {category?.title}
        </Link>
        <span>/</span>
        <span className="text-paper">{product.title}</span>
      </nav>

      <ProductView product={product} />

      {/* Описание и характеристики */}
      <section className="relative border-t border-line">
        <div className="relative grid gap-10 px-5 py-16 md:px-8 lg:grid-cols-2">
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
                            {size.from && (
                              <span className="text-muted">от </span>
                            )}
                            {formatPrice(size.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {product.customFit && (
                  <p className="mt-4 text-sm text-muted">
                    Не подходит ни один размер?{" "}
                    <Link href="/sizing" className="underline hover:text-brass">
                      Снимите замеры
                    </Link>{" "}
                    — сошьём по фигуре питомца.
                  </p>
                )}
              </div>
            )}

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm">
              <div>
                <dt className="label text-muted">Материал</dt>
                <dd className="mt-1">Натуральная кожа</dd>
              </div>
              <div>
                <dt className="label text-muted">Изготовление</dt>
                <dd className="mt-1">{product.productionDays} дней</dd>
              </div>
              <div>
                <dt className="label text-muted">Цвета кожи</dt>
                <dd className="mt-1">12 вариантов</dd>
              </div>
              <div>
                <dt className="label text-muted">Уход</dt>
                <dd className="mt-1">
                  <Link href="/care" className="underline hover:text-brass">
                    Как ухаживать
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-5 pb-8 md:px-8">
          <h2 className="display py-8 text-2xl">Из этой же категории</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
