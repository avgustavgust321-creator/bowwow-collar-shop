import { z } from "zod";
import { measurements } from "@/content/categories";
import type { MeasurementId } from "@/content/categories";
import { hardwareById } from "@/content/leather";
import { colorOf } from "@/lib/palette";
import type { Product } from "@/lib/product-schema";

/**
 * Конфигурация изделия — то, что клиент собрал на карточке товара.
 * Одна и та же схема используется на клиенте и на сервере: цену
 * с клиента мы не принимаем, а пересчитываем при оформлении заказа.
 */
export const configurationSchema = z.object({
  fit: z.enum(["grid", "custom"]),
  sizeCode: z.string().optional(),
  measurements: z.record(z.string(), z.number().min(5).max(150)).optional(),
  /** id слота кожи → id цвета */
  leather: z.record(z.string(), z.string()),
  hardware: z.string().optional(),
  engraving: z.string().optional(),
  /** Заказ по идее: форма, отмеченные детали и описание своими словами */
  brief: z
    .object({
      shape: z.string().optional(),
      details: z.array(z.string()).max(20).optional(),
      idea: z.string().max(2000).optional(),
    })
    .optional(),
});

/** Короче этого описание идеи не принимаем — мастеру не с чего начать */
export const IDEA_MIN_CHARS = 10;

export type Configuration = z.infer<typeof configurationSchema>;

export type PriceBreakdown = {
  base: number;
  customFit: number;
  engraving: number;
  /** Доплата за фурнитуру: латунь бесплатно, серебро дороже */
  hardware: number;
  total: number;
  /** Цена предварительная: размер «от» или индивидуальные замеры */
  approximate: boolean;
};

function minSizePrice(product: Product): number {
  const sizes = product.sizes ?? [];
  return sizes.reduce((min, s) => Math.min(min, s.price), Infinity);
}

/**
 * Расчёт цены позиции. Единственное место, где считается сумма —
 * и корзина, и сервер при оформлении заказа зовут именно её.
 */
export function calcPrice(
  product: Product,
  config: Configuration,
): PriceBreakdown {
  let base: number;
  let approximate = false;

  if (product.price !== null) {
    base = product.price;
  } else if (config.fit === "custom") {
    // По индивидуальным замерам точную цену называет мастер:
    // показываем минимум по сетке и честно помечаем как предварительную.
    base = minSizePrice(product);
    approximate = true;
  } else {
    const size = (product.sizes ?? []).find((s) => s.code === config.sizeCode);
    if (!size) {
      base = minSizePrice(product);
      approximate = true;
    } else {
      base = size.price;
      approximate = Boolean(size.from);
    }
  }

  const customFit =
    config.fit === "custom" && product.customFit ? product.customFit.price : 0;

  const engraving =
    product.engraving && config.engraving?.trim() ? product.engraving.price : 0;

  const hardware =
    (product.hardware && config.hardware
      ? hardwareById.get(config.hardware)?.priceDelta
      : 0) ?? 0;

  // Изделие по идее покупателя оценивается только после разговора
  if (product.brief) approximate = true;

  return {
    base,
    customFit,
    engraving,
    hardware,
    total: base + customFit + engraving + hardware,
    approximate,
  };
}

/**
 * Проверка, что собранная конфигурация вообще применима к этому товару:
 * существующий размер, существующие цвета, длина гравировки.
 * Возвращает список ошибок — пустой массив означает «всё в порядке».
 */
export function validateConfiguration(
  product: Product,
  config: Configuration,
): string[] {
  const errors: string[] = [];

  if (product.sizes) {
    if (config.fit === "grid") {
      const known = product.sizes.some((s) => s.code === config.sizeCode);
      if (!known) errors.push("Выберите размер");
    } else if (!product.customFit) {
      errors.push("Для этого изделия нет индивидуальных замеров");
    }
  }

  if (config.fit === "custom" && product.customFit) {
    for (const field of product.customFit.fields) {
      const value = config.measurements?.[field];
      if (typeof value !== "number" || Number.isNaN(value)) {
        errors.push(`Укажите замер: ${measurements[field as MeasurementId].label}`);
      }
    }
  }

  for (const slot of product.leatherSlots) {
    const colorId = config.leather[slot.id];
    if (!colorOf(slot.palette, colorId)) {
      errors.push(`Выберите цвет: ${slot.label}`);
    }
  }

  if (product.hardware && (!config.hardware || !hardwareById.has(config.hardware))) {
    errors.push("Выберите фурнитуру");
  }

  const engraving = config.engraving?.trim();
  if (engraving) {
    if (!product.engraving) {
      errors.push("Для этого изделия гравировка недоступна");
    } else if (engraving.length > product.engraving.maxChars) {
      errors.push(
        `${product.engraving.label ?? "Гравировка"}: не длиннее ${product.engraving.maxChars} символов`,
      );
    }
  }

  if (product.brief) {
    const { shapes, details, ideaMaxChars } = product.brief;
    const brief = config.brief;
    if (!shapes.some((s) => s.id === brief?.shape)) {
      errors.push("Выберите форму");
    }
    if (brief?.details?.some((d) => !details.includes(d))) {
      errors.push("Неизвестная деталь в списке");
    }
    const idea = brief?.idea?.trim() ?? "";
    if (idea.length < IDEA_MIN_CHARS) {
      errors.push("Опишите идею — хотя бы пару слов о цветах и материале");
    } else if (idea.length > ideaMaxChars) {
      errors.push(`Описание идеи: не длиннее ${ideaMaxChars} символов`);
    }
  }

  return errors;
}

/** Конфигурация по умолчанию — с ней открывается карточка товара. */
export function defaultConfiguration(product: Product): Configuration {
  return {
    fit: "grid",
    sizeCode: product.sizes?.[0]?.code,
    leather: Object.fromEntries(
      product.leatherSlots.map((slot) => [slot.id, slot.defaultColor]),
    ),
    hardware: product.hardware ? "brass" : undefined,
    engraving: "",
    brief: product.brief
      ? { shape: product.brief.shapes[0].id, details: [], idea: "" }
      : undefined,
  };
}

/** Человекочитаемое описание конфигурации — для корзины и письма о заказе. */
export function describeConfiguration(
  product: Product,
  config: Configuration,
): string[] {
  const parts: string[] = [];

  if (product.sizes) {
    parts.push(
      config.fit === "custom"
        ? "Размер: по индивидуальным замерам"
        : `Размер: ${config.sizeCode}`,
    );
  }

  if (config.fit === "custom" && product.customFit) {
    for (const field of product.customFit.fields) {
      const value = config.measurements?.[field];
      if (value) {
        parts.push(`${measurements[field as MeasurementId].label}: ${value} см`);
      }
    }
  }

  for (const slot of product.leatherSlots) {
    const color = colorOf(slot.palette, config.leather[slot.id]);
    if (color) parts.push(`${slot.label}: ${color.name}`);
  }

  if (product.hardware && config.hardware) {
    const hw = hardwareById.get(config.hardware);
    if (hw) parts.push(`Фурнитура: ${hw.name}`);
  }

  if (product.brief && config.brief) {
    const shape = product.brief.shapes.find((s) => s.id === config.brief?.shape);
    if (shape) parts.push(`Форма: ${shape.title}`);
    if (config.brief.details?.length) {
      parts.push(`Детали: ${config.brief.details.join(", ")}`);
    }
    const idea = config.brief.idea?.trim();
    if (idea) parts.push(`Идея: «${idea}»`);
  }

  const engraving = config.engraving?.trim();
  if (engraving) {
    parts.push(`${product.engraving?.label ?? "Гравировка"}: «${engraving}»`);
  }

  return parts;
}
