import { products } from "@/content/products";
import type { CategoryId, PetId } from "@/content/categories";
import type { Product } from "@/lib/product-schema";

export { products };

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Минимальная цена товара — то, что показываем на карточке в каталоге. */
export function priceFrom(product: Product): { value: number; from: boolean } {
  if (product.price !== null) {
    return { value: product.price, from: false };
  }
  const sizes = product.sizes ?? [];
  const min = sizes.reduce(
    (acc, s) => (s.price < acc.price ? s : acc),
    sizes[0]!,
  );
  return { value: min.price, from: sizes.length > 1 || Boolean(min.from) };
}

export const sortOptions = [
  { id: "default", label: "По умолчанию" },
  { id: "price-asc", label: "Сначала дешевле" },
  { id: "price-desc", label: "Сначала дороже" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export function filterProducts({
  category,
  pet,
  sort = "default",
}: {
  category?: CategoryId;
  pet?: PetId;
  sort?: SortId;
}): Product[] {
  let list = [...products];

  if (category) list = list.filter((p) => p.category === category);
  if (pet) list = list.filter((p) => (p.pet as string[]).includes(pet));

  if (sort === "price-asc") {
    list.sort((a, b) => priceFrom(a).value - priceFrom(b).value);
  } else if (sort === "price-desc") {
    list.sort((a, b) => priceFrom(b).value - priceFrom(a).value);
  }

  return list;
}

/**
 * Какие кадры показывать для выбранного цвета.
 *
 * Если под цвет есть настоящая съёмка — берём её и расчётную перекраску
 * не применяем. Фотография всегда точнее вычисленного оттенка.
 */
export function framesFor(
  product: Product,
  colorId?: string,
): { frames: string[]; real: boolean } {
  const slot = product.tint
    ? product.leatherSlots.find((s) => s.id === product.tint!.slot)
    : undefined;
  const color = colorId ?? slot?.defaultColor;
  const shots = color ? product.colorPhotos?.[color] : undefined;

  return shots?.length
    ? { frames: shots, real: true }
    : { frames: product.images, real: false };
}

/** Форматирование цены в белорусских рублях. */
export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-BY")} р.`;
}
