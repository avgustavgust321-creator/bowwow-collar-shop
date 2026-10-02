/**
 * Фотографии товара из его папки.
 *
 * Опись папок собирает scripts/photo-manifest.mjs перед каждой сборкой.
 * Здесь файлы раскладываются по правилам, записанным для владельца
 * в public/images/tovary/_КАК-ДОБАВЛЯТЬ-ФОТО.txt:
 *
 *   • файл назван по цвету («tiffani.jpg», «Тиффани.jpg») — это снимок
 *     именно этого цвета, он показывается, когда цвет выбран;
 *   • любой другой файл — общий снимок товара; общие идут в галерее по
 *     порядку имён, поэтому их удобно нумеровать: 1-…, 2-…, 3-…
 */
import manifest from "@/content/photo-manifest.json";
import { colorFromFileName, type PaletteId } from "@/lib/palette";

const BASE = "/images/tovary";
const folders = manifest as Record<string, string[]>;

export type ProductPhotos = {
  images: string[];
  colorPhotos: Record<string, string[]>;
};

export function photosIn(folder: string, palette: PaletteId): ProductPhotos {
  const files = folders[folder];
  if (!files) {
    // Не роняем сборку: у модели просто пока нет фото — покажется заглушка.
    // Раньше здесь была ошибка, и сайт не собирался на сервере, потому что
    // git не хранит пустые папки. Опечатку в поле photos видно по этому
    // предупреждению в логе сборки.
    console.warn(`Фото: папки «${folder}» нет в public/images/tovary`);
    return { images: [], colorPhotos: {} };
  }

  const images: string[] = [];
  const colorPhotos: Record<string, string[]> = {};

  for (const file of files) {
    const url = `${BASE}/${folder}/${file}`;
    const color = colorFromFileName(palette, file);
    if (color) (colorPhotos[color.id] ??= []).push(url);
    else images.push(url);
  }

  // «tiffani.jpg» раньше «tiffani-2.jpg»: при сортировке с расширением
  // дефис обгонял точку, и главным снимком цвета становился дубль
  const stem = (url: string) => url.replace(/\.[^.]+$/, "");
  for (const list of Object.values(colorPhotos)) {
    list.sort((a, b) =>
      stem(a).localeCompare(stem(b), "ru", { numeric: true }),
    );
  }

  return { images, colorPhotos };
}

/**
 * Подставляет фото в сырую запись товара до проверки каталога.
 * Цвет на фотографии сверяется с палитрой главного слота — у ошейника
 * с подкладом это подклад, у миски — цвет основы.
 */
export function withPhotos<
  T extends {
    photos: string;
    leatherSlots: { id: string; fixed?: boolean; palette?: PaletteId }[];
  },
>(raw: T): T & ProductPhotos {
  const main = raw.leatherSlots.find((s) => !s.fixed) ?? raw.leatherSlots[0];
  return { ...raw, ...photosIn(raw.photos, main?.palette ?? "leather") };
}
