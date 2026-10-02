export const categories = [
  {
    id: "collars",
    title: "Ошейники",
    single: "Ошейник",
    description:
      "Однотонные, с цветным подкладом и по вашей идее. От XS для мелких пород до Big Boss.",
  },
  {
    id: "harnesses",
    title: "Шлейки",
    single: "Шлейка",
    description:
      "Шлейки на четыре пряжки — регулируются по четырём замерам питомца.",
  },
  {
    id: "leashes",
    title: "Поводки",
    single: "Поводок",
    description: "Поводки Lap, перестёжки и модели с плоской кожаной ручкой.",
  },
  {
    id: "accessories",
    title: "Аксессуары",
    single: "Аксессуар",
    description: "Холдеры для пакетов и мелочи, которые носят с собой.",
  },
  {
    id: "bowls",
    title: "Миски",
    single: "Миска",
    description:
      "Печатаются на 3D-принтере в ваших цветах и с вашей надписью по кругу.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

/** Ключ намеренно расширен до string: id приходит из каталога и из URL. */
export const categoryById = new Map<string, (typeof categories)[number]>(
  categories.map((c) => [c.id, c]),
);

/** Для кого изделие — фильтр в каталоге. */
export const pets = [
  { id: "dog", title: "Собаки" },
  { id: "cat", title: "Кошки" },
] as const;

export type PetId = (typeof pets)[number]["id"];

/**
 * Замеры питомца. Формулировки взяты из фирменной инструкции бренда
 * «Как замерить собаку», чтобы сайт и инстаграм говорили одинаково.
 */
export const measurements = {
  neck: {
    id: "neck",
    label: "Обхват шеи",
    hint: "В самой широкой части шеи, от холки",
  },
  chest: {
    id: "chest",
    label: "Обхват грудной клетки",
    hint: "По самому широкому месту, 1–4 пальца от подмышки",
  },
  backLength: {
    id: "backLength",
    label: "Длина спинки шлейки",
    hint: "От холки до грудного обхвата",
  },
  chestPlate: {
    id: "chestPlate",
    label: "Длина грудки шлейки",
    hint: "От основания шеи до грудного обхвата",
  },
} as const;

export type MeasurementId = keyof typeof measurements;
