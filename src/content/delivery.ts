/**
 * Способы доставки.
 * ЗАПОЛНИТЬ: реальные стоимости и сроки. price 0 показывается как «бесплатно»,
 * priceNote — текст вместо цены, если стоимость считается по тарифу перевозчика.
 */
export const deliveryOptions = [
  {
    id: "pickup",
    title: "Самовывоз",
    hint: "Минск, по договорённости",
    price: 0,
    needsAddress: false,
  },
  {
    id: "courier-minsk",
    title: "Курьер по Минску",
    hint: "1–2 дня после готовности заказа",
    price: 0, // ЗАПОЛНИТЬ стоимость
    needsAddress: true,
  },
  {
    id: "europochta",
    title: "Европочта",
    hint: "По всей Беларуси, до отделения",
    price: 0, // ЗАПОЛНИТЬ стоимость
    priceNote: "по тарифу перевозчика",
    needsAddress: true,
  },
] as const;

export type DeliveryId = (typeof deliveryOptions)[number]["id"];

/** Ключ намеренно расширен до string: id приходит из формы и из zod-схемы. */
export const deliveryById = new Map<string, (typeof deliveryOptions)[number]>(
  deliveryOptions.map((d) => [d.id, d]),
);
