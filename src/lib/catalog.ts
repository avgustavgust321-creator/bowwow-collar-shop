import { products } from "@/content/products";
import type { CategoryId, PetId } from "@/content/categories";
import type { Product } from "@/lib/product-schema";

export { products };

/**
 * Товары, которые видны покупателю: без черновиков. Черновик открывается
 * по прямой ссылке, но в каталог, на главную и в карту сайта не попадает.
 */
export const listedProducts = products.filter((p) => !p.draft);

/**
 * Главный цветовой слот товара — тот, от которого зависит фото.
 * У ошейника с подкладом это подклад (верх у него постоянный),
 * у однотонного — сама кожа, у миски — цвет основы.
 */
export function mainSlot(product: Product) {
  return (
    (product.tint
      ? product.leatherSlots.find((s) => s.id === product.tint!.slot)
      : undefined) ??
    product.leatherSlots.find((s) => !s.fixed) ??
    product.leatherSlots[0]
  );
}

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
  let list = [...listedProducts];

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
 * Сначала снимки именно этого цвета, если они есть, за ними — общие
 * снимки товара. real = true означает, что первый кадр — настоящая
 * съёмка выбранного цвета и расчётная перекраска не нужна.
 */
export function framesFor(
  product: Product,
  colorId?: string,
): { frames: string[]; real: boolean } {
  const color = colorId ?? mainSlot(product)?.defaultColor;
  const shots = (color ? product.colorPhotos?.[color] : undefined) ?? [];

  return {
    frames: [...shots, ...product.images],
    real: shots.length > 0,
  };
}

/** Форматирование цены в белорусских рублях. */
export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-BY")} р.`;
}

/** Срок изготовления: «7–10 дней», если задана верхняя граница, иначе «7 дней». */
export function productionTerm(product: Product): string {
  const { productionDays: min, productionDaysMax: max } = product;
  return max && max > min ? `${min}–${max} дней` : `${min} дней`;
}
