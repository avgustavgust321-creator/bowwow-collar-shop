/**
 * Палитры материалов.
 *
 * Слот выбора цвета у товара ссылается на палитру: кожа — для ошейников,
 * шлеек и поводков, пластик — для мисок с 3D-принтера. Всё, что работает
 * с цветами (конфигуратор, проверка заказа, описание в корзине), берёт
 * их отсюда и не знает, из какого материала изделие.
 */
import { leatherColors, type SwatchColor } from "@/content/leather";
import { plasticColors } from "@/content/plastic";

export const paletteIds = ["leather", "plastic"] as const;
export type PaletteId = (typeof paletteIds)[number];

const all: Record<PaletteId, SwatchColor[]> = {
  leather: leatherColors,
  plastic: plasticColors,
};

const byId: Record<PaletteId, Map<string, SwatchColor>> = {
  leather: new Map(leatherColors.map((c) => [c.id, c])),
  plastic: new Map(plasticColors.map((c) => [c.id, c])),
};

/** Все цвета палитры, включая невыбираемые (шоколадный верх ошейника). */
export function paletteColors(palette: PaletteId = "leather"): SwatchColor[] {
  return all[palette];
}

/** Цвета, которые клиент выбирает сам. */
export function selectableColors(palette: PaletteId = "leather"): SwatchColor[] {
  return all[palette].filter((c) => c.selectable !== false);
}

export function colorOf(
  palette: PaletteId | undefined,
  id: string | undefined,
): SwatchColor | undefined {
  return id ? byId[palette ?? "leather"].get(id) : undefined;
}

/**
 * Узнаёт цвет по имени файла: «tiffani.jpg», «Тиффани.jpg», «tiffani-2.jpg»
 * и «2-тиффани.jpg» — всё это Тиффани. Нужен, чтобы фото, названное по
 * цвету, само привязывалось к этому цвету на карточке товара.
 */
export function colorFromFileName(
  palette: PaletteId,
  fileName: string,
): SwatchColor | undefined {
  const stem = fileName
    .normalize("NFC")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/^\d+[-_ ]+/, "")
    .replace(/[-_ ]+\d+$/, "")
    .trim();

  return all[palette].find(
    (c) =>
      c.id === stem || c.name.toLowerCase().replace(/ё/g, "е") === stem,
  );
}
