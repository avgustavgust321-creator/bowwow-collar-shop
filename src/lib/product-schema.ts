import { z } from "zod";
import { categories, measurements, pets } from "@/content/categories";
import { leatherColors } from "@/content/leather";
import { colorOf, paletteIds } from "@/lib/palette";

const categoryIds = categories.map((c) => c.id) as [string, ...string[]];
const petIds = pets.map((p) => p.id) as [string, ...string[]];
const leatherIds = leatherColors.map((c) => c.id) as [string, ...string[]];
const measurementIds = Object.keys(measurements) as [string, ...string[]];

/** Позиция размерной сетки. Цена у каждого размера своя — так устроен прайс бренда. */
export const sizeOptionSchema = z.object({
  code: z.string().min(1),
  /** Пояснение к размеру: «до 2,5 кг», «обхват шеи 22–28 см» */
  note: z.string().optional(),
  price: z.number().positive(),
  /** Цена «от» — точную назовёт мастер после замеров */
  from: z.boolean().optional(),
  /**
   * Мерки, которые нужно указать при выборе этого размера. Так устроен
   * Big Boss: размер открытый сверху, поэтому просим обхват шеи.
   */
  measure: z.array(z.enum(measurementIds)).min(1).optional(),
});

/**
 * Слот выбора цвета: у ошейника с подкладом их два — верх и подклад,
 * у миски — основа и надпись. Имя «leather» историческое: слот бывает
 * и пластиковым, палитру задаёт поле palette.
 */
export const leatherSlotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** Из какой палитры цвета: кожа (по умолчанию) или пластик */
  palette: z.enum(paletteIds).optional(),
  defaultColor: z.string().min(1),
  /**
   * Цвет зафиксирован моделью и не выбирается — показывается справочно.
   * Так устроен ошейник с подкладом: верх всегда одного цвета.
   */
  fixed: z.boolean().optional(),
}).refine((s) => Boolean(colorOf(s.palette, s.defaultColor)), {
  message: "defaultColor нет в палитре этого слота",
});

/**
 * Перекраска фотографии под выбранный цвет.
 * masks[i] — маска области для images[i]; пустая строка означает,
 * что на этом кадре красить нечего.
 */
export const tintSchema = z.object({
  slot: z.string().min(1),
  masks: z.array(z.string()),
});

export const productSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/, "slug только из латиницы, цифр и дефисов"),
    title: z.string().min(1),
    category: z.enum(categoryIds),
    pet: z.array(z.enum(petIds)).min(1),
    summary: z.string().min(1),
    description: z.array(z.string().min(1)).min(1),
    /**
     * Папка с фото внутри public/images/tovary, например
     * «1-oshejniki/s-podkladom». Всё, что в ней лежит, подключается само.
     */
    photos: z.string().min(1),
    /** Общие кадры — заполняются из папки, вручную не пишутся */
    images: z.array(z.string().startsWith("/")),
    /** Цвет подложки-заглушки, пока нет фотографий */
    placeholder: z.enum(leatherIds),
    sizes: z.array(sizeOptionSchema).min(1).nullable(),
    /** Единая цена для товаров без размерной сетки */
    price: z.number().positive().nullable(),
    leatherSlots: z.array(leatherSlotSchema),
    tint: tintSchema.nullable().optional(),
    /**
     * Настоящие снимки под каждый цвет: id цвета → список кадров.
     * Если для выбранного цвета снимок есть, показывается он, а расчётная
     * перекраска не применяется — фотография всегда честнее.
     */
    colorPhotos: z
      .record(z.string(), z.array(z.string().startsWith("/")).min(1))
      .optional(),
    hardware: z.boolean(),
    /**
     * Персональный текст: гравировка на ремне ошейника, надпись на миске.
     * label и placeholder меняют подписи поля под изделие.
     */
    engraving: z
      .object({
        /** Не указано — длина текста не ограничена */
        maxChars: z.number().int().positive().optional(),
        price: z.number().min(0),
        label: z.string().optional(),
        placeholder: z.string().optional(),
        /** Id слота, в цвет которого окрашен текст — для превью */
        colorSlot: z.string().optional(),
      })
      .nullable(),
    customFit: z
      .object({
        price: z.number().min(0),
        fields: z.array(z.enum(measurementIds)).min(1),
      })
      .nullable(),
    productionDays: z.number().int().positive(),
    /** Верхняя граница срока: выводится как «7–10 дней». */
    productionDaysMax: z.number().int().positive().optional(),
    collection: z.string().optional(),
    badge: z.string().optional(),
    /**
     * Изделие обсуждается и заказывается в инстаграме: на карточке нет
     * конструктора и корзины, только ссылка в личные сообщения.
     */
    viaInstagram: z.boolean().optional(),
    /**
     * Длина поводка: базовая и шаг удлинения с доплатой за каждый шаг.
     * maxSteps — сколько шагов можно добавить на сайте.
     */
    length: z
      .object({
        base: z.number().positive(),
        step: z.number().positive(),
        pricePerStep: z.number().min(0),
        maxSteps: z.number().int().positive(),
      })
      .optional(),
    /** Пояснение в конструкторе — например, что ещё уточняется после заказа */
    configNote: z.string().optional(),
    /** Живое превью изделия в выбранных цветах вместо заглушки */
    livePreview: z.enum(["bowl"]).optional(),
    /**
     * Черновик: товар открывается по прямой ссылке, но не виден в каталоге,
     * на главной и в карте сайта — пока не проставлены цены.
     */
    draft: z.boolean().optional(),
  })
  .refine((p) => (p.sizes === null) !== (p.price === null), {
    message: "У товара должна быть либо размерная сетка, либо единая цена",
  })
  .refine(
    (p) =>
      !p.tint ||
      (p.leatherSlots.some((s) => s.id === p.tint!.slot) &&
        p.tint.masks.length === p.images.length),
    {
      message:
        "tint.slot должен ссылаться на существующий слот кожи, " +
        "а masks — совпадать по длине с images",
    },
  );

export type Product = z.infer<typeof productSchema>;
export type SizeOption = z.infer<typeof sizeOptionSchema>;
export type LeatherSlot = z.infer<typeof leatherSlotSchema>;

/**
 * Проверка каталога при загрузке модуля: опечатка в цене, несуществующий
 * цвет кожи или дублирующийся slug ломают сборку, а не витрину.
 */
export function validateCatalog(input: unknown[]): Product[] {
  const products = input.map((raw, i) => {
    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      const where =
        typeof raw === "object" && raw && "slug" in raw
          ? String((raw as { slug: unknown }).slug)
          : `позиция №${i + 1}`;
      throw new Error(
        `Ошибка в каталоге (${where}):\n` +
          parsed.error.issues
            .map((iss) => `  • ${iss.path.join(".") || "—"}: ${iss.message}`)
            .join("\n"),
      );
    }
    return parsed.data;
  });

  const slugs = new Set<string>();
  for (const p of products) {
    if (slugs.has(p.slug)) {
      throw new Error(`Ошибка в каталоге: slug «${p.slug}» повторяется`);
    }
    slugs.add(p.slug);
  }

  return products;
}
