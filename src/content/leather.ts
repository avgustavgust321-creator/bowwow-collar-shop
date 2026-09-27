/**
 * Палитра кожи и фурнитуры BOW WOW COLLAR.
 *
 * Названия взяты из фирменных сторис бренда — это часть айдентики,
 * клиент выбирает «пепа» и «нарния», а не «розовый» и «бирюзовый».
 *
 * HEX сняты пипеткой с фирменных фотографий образцов кожи — каждый
 * образец там подписан. Если оттенок на экране отличается от реальной кожи, поправьте значение здесь —
 * оно подтянется в свотчи, фильтры и превью товара.
 */

/** Цвет в любой палитре — кожи или пластика. */
export type SwatchColor = {
  id: string;
  name: string;
  hex: string;
  /** Тёмный оттенок — подпись поверх свотча должна быть светлой */
  dark?: boolean;
  /**
   * false — цвет не предлагается на выбор, но остаётся валидным.
   * Так устроен верх двухцветного ошейника: он всегда шоколадный.
   */
  selectable?: boolean;
};

export type LeatherColor = SwatchColor;

export const leatherColors: LeatherColor[] = [
  { id: "slizerin", name: "Слизерин", hex: "#323E35", dark: true },
  { id: "matrica", name: "Матрица", hex: "#297047", dark: true },
  { id: "ulun", name: "Улун", hex: "#D3E189" },
  { id: "taxi", name: "Такси", hex: "#CE7127", dark: true },
  { id: "amster", name: "Амстер", hex: "#A91828", dark: true },
  { id: "opera", name: "Опера", hex: "#390D0F", dark: true },
  { id: "pepa", name: "Пепа", hex: "#E15061" },
  { id: "lilu", name: "Лилу", hex: "#F15E30", dark: true },
  { id: "titanik", name: "Титаник", hex: "#262937", dark: true },
  { id: "nordik", name: "Нордик", hex: "#624E47", dark: true },
  { id: "narnia", name: "Нарния", hex: "#597571", dark: true },
  { id: "tiffani", name: "Тиффани", hex: "#7BDFC6" },

  // Верх двухцветного ошейника. На выбор не предлагается — он всегда один.
  // HEX снят пипеткой со студийных снимков, а не подобран на глаз.
  {
    id: "chocolate",
    name: "Шоколад",
    hex: "#714D31",
    dark: true,
    selectable: false,
  },
];

export const leatherById = new Map(leatherColors.map((c) => [c.id, c]));

/** Двенадцать оттенков, которые клиент действительно выбирает. */
export const selectableLeatherColors = leatherColors.filter(
  (c) => c.selectable !== false,
);

/**
 * Фурнитура. Латунь идёт по умолчанию, серебро — за доплату.
 * priceDelta прибавляется к цене изделия при расчёте.
 */
export type HardwareOption = {
  id: string;
  name: string;
  hex: string;
  /** Доплата в рублях; 0 — вариант по умолчанию */
  priceDelta: number;
};

export const hardwareOptions: HardwareOption[] = [
  { id: "brass", name: "Латунь", hex: "#A9813E", priceDelta: 0 },
  { id: "silver", name: "Серебро", hex: "#B9BCC0", priceDelta: 10 },
];

export const hardwareById = new Map(hardwareOptions.map((h) => [h.id, h]));
