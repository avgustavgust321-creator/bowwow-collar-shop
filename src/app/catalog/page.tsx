import type { Metadata } from "next";
import { Filters } from "@/components/catalog/Filters";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, categoryById, pets } from "@/content/categories";
import type { CategoryId, PetId } from "@/content/categories";
import { filterProducts, sortOptions } from "@/lib/catalog";
import type { SortId } from "@/lib/catalog";

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

/**
 * Заголовки разделов для поиска — так, как их ищут: «кожаный ошейник для
 * собаки», а не «Ошейники». Видимый заголовок на странице короче.
 */
const categorySeo: Record<CategoryId, { title: string; description: string }> = {
  collars: {
    title: "Кожаные ошейники для собак ручной работы",
    description:
      "Кожаные ошейники для собак из итальянской кожи: однотонные, с цветным подкладом и по вашей идее. Размеры от XS до Big Boss, гравировка имени, доставка по Беларуси.",
  },
  harnesses: {
    title: "Кожаные шлейки для собак по меркам",
    description:
      "Шлейка на четыре пряжки из натуральной кожи: шьём по меркам собаки, не давит на горло. Изготовление 7–10 дней, доставка по Беларуси.",
  },
  leashes: {
    title: "Поводки для собак с кожаными деталями",
    description:
      "Поводки Lap, перестёжки и с плоской кожаной ручкой ручной работы. Длина на выбор, литая фурнитура, доставка по Беларуси.",
  },
  accessories: {
    title: "Кожаные аксессуары для прогулки с собакой",
    description:
      "Холдер для пакетов «Круассан» из натуральной кожи — пристёгивается к поводку или сумке. Ручная работа, Брест.",
  },
  bowls: {
    title: "Миски для собак и кошек с надписью",
    description:
      "Миска на 250, 500 или 800 мл с вашей надписью по кругу: 25 цветов основы и текста, внутри чаша из нержавеющей стали.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const category = pick(sp.category, categoryIds) as CategoryId | undefined;

  if (category) {
    const seo = categorySeo[category];
    return {
      title: seo.title,
      description: seo.description,
      // Фильтр по питомцу и сортировка — те же товары, канонической
      // остаётся страница раздела
      alternates: { canonical: `/catalog?category=${category}` },
    };
  }

  return {
    title: "Каталог кожаной амуниции для собак",
    description:
      "Ошейники, шлейки, поводки, аксессуары и миски ручной работы из Бреста. " +
      "Итальянская кожа, 12 цветов, размер по меркам, доставка по Беларуси.",
    alternates: { canonical: "/catalog" },
  };
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
          <h1 className="display-xl mt-1 text-ink">
            {activeCategory ? activeCategory.title : "Каталог"}
          </h1>
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
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
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
