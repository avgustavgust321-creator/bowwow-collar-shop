import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { PageHeader } from "@/components/ui/Page";
import { listedProducts as products } from "@/lib/catalog";
import type { Product } from "@/lib/product-schema";

export const metadata: Metadata = {
  title: "Коллекции",
  description:
    "Изделия BOW WOW COLLAR по коллекциям: двухцветные ошейники, базовая линейка, амуниция, поводки и мелочи.",
};

/** Группировка по полю collection из каталога — порядок как в файле товаров. */
function groupByCollection(list: Product[]): Array<[string, Product[]]> {
  const groups = new Map<string, Product[]>();
  for (const product of list) {
    const name = product.collection ?? "Прочее";
    const bucket = groups.get(name);
    if (bucket) bucket.push(product);
    else groups.set(name, [product]);
  }
  return [...groups.entries()];
}

export default function CollectionsPage() {
  const groups = groupByCollection(products);

  return (
    <>
      <PageHeader
        title="Коллекции"
        lead="Одна палитра кожи и одна фурнитура на всю линейку — изделия из разных коллекций собираются в комплект."
      />

      {groups.map(([name, items]) => (
        <section key={name} className="wrap px-5 pt-12 md:px-10">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
            <h2 className="display text-3xl md:text-4xl">{name}</h2>
            <span className="label text-muted">{items.length}</span>
          </div>
          <div className="mt-px grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ))}

      <div className="h-8" />
    </>
  );
}
