/**
 * Способы доставки.
 *
 * price — стоимость в рублях; 0 показывается как «бесплатно».
 * needsAddress — просить ли адрес в форме оформления.
 *
 * Самовывоза нет: мастерская не принимает клиентов, всё уезжает почтой
 * или курьером. Раньше в списке он был — это была заглушка.
 */
export const deliveryOptions = [
  {
    id: "europochta",
    title: "Европочта",
    hint: "По всей Беларуси, до отделения",
    price: 6,
    needsAddress: true,
  },
  {
    id: "courier-brest",
    title: "Курьер по Бресту",
    hint: "1–2 дня после готовности заказа",
    price: 6,
    needsAddress: true,
  },
] as const;

export type DeliveryId = (typeof deliveryOptions)[number]["id"];

/** Ключ намеренно расширен до string: id приходит из формы и из zod-схемы. */
export const deliveryById = new Map<string, (typeof deliveryOptions)[number]>(
  deliveryOptions.map((d) => [d.id, d]),
);
