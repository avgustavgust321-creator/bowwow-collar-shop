import type { Metadata } from "next";
import { Filters } from "@/components/catalog/Filters";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, categoryById, pets } from "@/content/categories";
import type { CategoryId, PetId } from "@/content/categories";
import { filterProducts, sortOptions } from "@/lib/catalog";
import type { SortId } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог",
  description:
    "Ошейники, шлейки, поводки и аксессуары из натуральной кожи ручной работы. " +
    "12 цветов кожи, размеры по сетке или по индивидуальным замерам.",
};

const categoryIds = new Set(categories.map((c) => c.id as string));
const petIds = new Set(pets.map((p) => p.id as string));
const sortIds = new Set(sortOptions.map((s) => s.id as string));

function pick(
  value: string | string[] | undefined,
  allowed: Set<string>,
): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && allowed.has(v) ? v : undefined;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const category = pick(sp.category, categoryIds) as CategoryId | undefined;
  const pet = pick(sp.pet, petIds) as PetId | undefined;
  const sort = (pick(sp.sort, sortIds) as SortId | undefined) ?? "default";

  const list = filterProducts({ category, pet, sort });
  const activeCategory = category ? categoryById.get(category) : undefined;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="wrap relative px-5 pt-14 pb-10 md:px-10 md:pt-20">
          <p className="hand -rotate-3 text-3xl text-gold-ink md:text-4xl">
            сшито в Бресте
          </p>
          <h1 className="display-xl mt-1 text-ink">Каталог</h1>
          {activeCategory && (
            <p className="mt-6 max-w-xl text-muted">
              {activeCategory.description}
            </p>
          )}
        </div>
      </section>

      <div className="wrap px-5 md:px-10">
        <Filters params={{ category, pet, sort: sp.sort as string | undefined }} />
      </div>

      <section className="wrap px-5 pb-8 md:px-10">
        <p className="label py-5 text-muted">
          {list.length}{" "}
          {list.length === 1
            ? "изделие"
            : list.length < 5
              ? "изделия"
              : "изделий"}
        </p>

        {list.length === 0 ? (
          <p className="py-16 text-center text-muted">
            В этой категории пока ничего нет. Загляните в другие разделы.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((product, i) => (
              <ProductCard
                key={product.slug}
                product={product}
                priority={i < 4}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
