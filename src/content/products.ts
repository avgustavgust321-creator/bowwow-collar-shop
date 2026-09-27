/**
 * КАТАЛОГ BOW WOW COLLAR
 * ═══════════════════════════════════════════════════════════════
 * Это единственный файл, который нужно править, чтобы изменить
 * товары, цены и описания. Всё остальное подтянется само.
 *
 * Цены — в белорусских рублях, взяты из действующего прайса бренда.
 *
 * ЧТО НУЖНО ДОПОЛНИТЬ (помечено ЗАПОЛНИТЬ по тексту):
 *   1. Обхваты шеи в сантиметрах для размеров ошейников XS…XL
 *      и вес/обхват для размера large у шлейки — без них клиент
 *      не сможет выбрать размер по сетке.
 *   2. Доплату за индивидуальные замеры (сейчас 0 — «бесплатно»).
 *   3. Доплату за гравировку (сейчас 0 — «бесплатно»).
 *   4. Реальные сроки изготовления в днях.
 *   5. Фотографии: положить в /public/images/products/ и вписать
 *      пути в images. Пока массив пустой — показывается заглушка
 *      цветом кожи из поля placeholder.
 *   6. Тексты описаний написаны как черновик по материалам
 *      инстаграма — перечитайте и поправьте под свой голос.
 * ═══════════════════════════════════════════════════════════════
 */

import { validateCatalog } from "@/lib/product-schema";

export const products = validateCatalog([
  {
    slug: "collar-lined",
    title: "Ошейник с цветным подкладом",
    category: "collars",
    pet: ["dog", "cat"],
    collection: "Двухцветные",
    badge: "Хит",
    summary:
      "Два цвета кожи в одном ошейнике: снаружи один, изнутри — контрастный подклад.",
    description: [
      "Двухслойный ошейник из натуральной кожи: снаружи фирменный коньячный верх, изнутри — цветной подклад на ваш выбор.",
      "Подклад мягче верхнего слоя и не натирает шерсть даже при постоянной носке. Строчка идёт по всей длине, а места у пряжки и колец прошиваются иглой — туда машинка не достаёт.",
      "Фурнитура — литая пряжка и полукольцо под адресник. Каждый ошейник шьётся под конкретного питомца.",
    ],
    images: [
      "/images/products/collar-lined-front.png",
      "/images/products/collar-lined-side.png",
    ],
    placeholder: "pepa",
    sizes: [
      { code: "XS", note: "обхват шеи 21–26 см", price: 90 },
      { code: "S", note: "25–31 см", price: 110 },
      { code: "M", note: "30–36 см", price: 130 },
      { code: "L", note: "35–43 см", price: 140 },
      { code: "XL", note: "42–50 см", price: 150 },
      {
        code: "Big Boss",
        price: 150,
        from: true,
        note: "от 50 см, усиленная фурнитура",
      },
    ],
    price: null,
    leatherSlots: [
      // Верх у этой модели всегда коньячный — выбирается только подклад.
      { id: "outer", label: "Основная кожа", defaultColor: "chocolate", fixed: true },
      { id: "lining", label: "Цвет подклада", defaultColor: "tiffani" },
    ],
    // Подклад на фотографии перекрашивается в выбранный цвет
    tint: {
      slot: "lining",
      masks: [
        "/images/products/collar-lined-front-tint.png",
        "/images/products/collar-lined-side-tint.png",
      ],
    },
    // Настоящие снимки под каждый цвет подклада — по одному кадру
    colorPhotos: {
      pepa: ["/images/products/collar-lined/pepa.jpg"], // Пепа
      titanik: ["/images/products/collar-lined/titanik.jpg"], // Титаник
      amster: ["/images/products/collar-lined/amster.jpg"], // Амстер
      slizerin: ["/images/products/collar-lined/slizerin.jpg"], // Слизерин
      matrica: ["/images/products/collar-lined/matrica.jpg"], // Матрица
      ulun: ["/images/products/collar-lined/ulun.jpg"], // Улун
      taxi: ["/images/products/collar-lined/taxi.jpg"], // Такси
      opera: ["/images/products/collar-lined/opera.jpg"], // Опера
      lilu: ["/images/products/collar-lined/lilu.jpg"], // Лилу
      narnia: ["/images/products/collar-lined/narnia.jpg"], // Нарния
      tiffani: ["/images/products/collar-lined/tiffani.jpg"], // Тиффани
      nordik: ["/images/products/collar-lined/nordik.jpg"], // Нордик
    },
    hardware: true,
    engraving: { maxChars: 14, price: 10 },
    customFit: { price: 0, fields: ["neck"] }, // ЗАПОЛНИТЬ цену
    productionDays: 7,
    productionDaysMax: 10,
  },

  {
    slug: "collar-solid",
    title: "Ошейник однотонный",
    category: "collars",
    pet: ["dog", "cat"],
    collection: "Базовые",
    summary: "Классический ошейник в одном цвете. Базовая модель линейки.",
    description: [
      "Однослойный ошейник из плотной натуральной кожи. Тот же крой и та же фурнитура, что у двухцветной модели, но без подклада — и заметно доступнее.",
      "Двенадцать цветов кожи: от почти чёрного «Слизерина» до мятного «Тиффани».",
      "Кожа со временем темнеет и полируется от носки — ошейник становится только лучше.",
    ],
    images: [
      "/images/products/collar-solid-main.png",
      "/images/products/collar-solid-colors.png",
    ],
    placeholder: "amster",
    sizes: [
      { code: "XS", note: "обхват шеи 21–26 см", price: 65 },
      { code: "S", note: "25–31 см", price: 75 },
      { code: "M", note: "30–36 см", price: 80 },
      { code: "L", note: "35–43 см", price: 90 },
      { code: "XL", note: "42–50 см", price: 110 },
    ],
    price: null,
    leatherSlots: [{ id: "outer", label: "Цвет кожи", defaultColor: "amster" }],
    // У однотонной модели перекрашивается всё изделие целиком.
    // Второй кадр витринный — там цвета показаны как есть, маски нет.
    tint: {
      slot: "outer",
      masks: ["/images/products/collar-solid-main-tint.png", ""],
    },
    // Настоящие снимки каждого цвета на песочном фоне — по одному кадру.
    // Пока цвет есть здесь, перекраска по маске для него не применяется.
    colorPhotos: {
      pepa: ["/images/products/collar-solid/pepa.jpg"], // Пепа
      titanik: ["/images/products/collar-solid/titanik.jpg"], // Титаник
      amster: ["/images/products/collar-solid/amster.jpg"], // Амстер
      slizerin: ["/images/products/collar-solid/slizerin.jpg"], // Слизерин
      matrica: ["/images/products/collar-solid/matrica.jpg"], // Матрица
      ulun: ["/images/products/collar-solid/ulun.jpg"], // Улун
      taxi: ["/images/products/collar-solid/taxi.jpg"], // Такси
      opera: ["/images/products/collar-solid/opera.jpg"], // Опера
      lilu: ["/images/products/collar-solid/lilu.jpg"], // Лилу
      narnia: ["/images/products/collar-solid/narnia.jpg"], // Нарния
      tiffani: ["/images/products/collar-solid/tiffani.jpg"], // Тиффани
      nordik: ["/images/products/collar-solid/nordik.jpg"], // Нордик
    },
    hardware: true,
    engraving: { maxChars: 14, price: 10 },
    customFit: { price: 0, fields: ["neck"] }, // ЗАПОЛНИТЬ цену
    productionDays: 7,
    productionDaysMax: 10,
  },

  {
    slug: "harness-4-buckle",
    title: "Шлейка на четыре пряжки",
    category: "harnesses",
    pet: ["dog"],
    collection: "Амуниция",
    badge: "Под замеры",
    summary:
      "Регулируется в четырёх точках — садится по фигуре, не давит на горло.",
    description: [
      "Шлейка на четыре пряжки настраивается по обхвату груди, обхвату шеи, длине спинки и длине грудки. За счёт этого она садится по корпусу и не съезжает.",
      "Нагрузка уходит на грудь, а не на шею — это безопаснее для брахицефалов и для собак, которые тянут поводок.",
      "Шьётся из той же кожи, что и ошейники, поэтому комплект собирается в один цвет.",
    ],
    images: [],
    placeholder: "narnia",
    sizes: [
      { code: "Small", note: "до 2,5 кг", price: 150 },
      { code: "Medium", note: "до 12 кг", price: 175 },
      { code: "Large", price: 229 }, // ЗАПОЛНИТЬ note: до скольки кг
    ],
    price: null,
    leatherSlots: [
      { id: "outer", label: "Основная кожа", defaultColor: "narnia" },
      { id: "lining", label: "Цвет подклада", defaultColor: "tiffani" },
    ],
    hardware: true,
    engraving: null,
    customFit: {
      price: 0, // ЗАПОЛНИТЬ цену
      fields: ["chest", "backLength", "neck", "chestPlate"],
    },
    productionDays: 7,
    productionDaysMax: 10,
  },

  {
    slug: "leash-lap",
    title: "Поводок Lap",
    category: "leashes",
    pet: ["dog"],
    collection: "Поводки",
    summary: "Круглый шнур с кожаными вставками и латунным карабином.",
    description: [
      "Мягкий круглый шнур не режет ладонь и не путается, кожаные вставки закрывают места крепления.",
      "Карабин литой, с широким зевом — легко пристёгивается одной рукой.",
      "В отличие от рулетки поводок держит постоянную длину: собака всегда понимает границу, а рука не устаёт от рывков.",
    ],
    images: [],
    placeholder: "opera",
    sizes: null,
    price: 99,
    leatherSlots: [
      { id: "outer", label: "Цвет кожаных вставок", defaultColor: "nordik" },
    ],
    hardware: true,
    engraving: null,
    customFit: null,
    productionDays: 7,
    productionDaysMax: 10,
  },

  {
    slug: "leash-adjustable",
    title: "Поводок-перестёжка",
    category: "leashes",
    pet: ["dog"],
    collection: "Поводки",
    summary:
      "Два карабина и кольца перестёжки: длина меняется прямо на прогулке.",
    description: [
      "Перестёжка превращается из короткого городского поводка в длинный за пару секунд — без узлов и лишних деталей.",
      "Можно носить через плечо, когда руки заняты, или пристегнуть к поясу.",
      "Кожаные элементы и фурнитура те же, что в остальной линейке, поэтому поводок собирается в комплект с ошейником.",
    ],
    images: [],
    placeholder: "titanik",
    sizes: null,
    price: 80,
    leatherSlots: [
      { id: "outer", label: "Цвет кожаных вставок", defaultColor: "titanik" },
    ],
    hardware: true,
    engraving: null,
    customFit: null,
    productionDays: 7,
    productionDaysMax: 10,
  },

  {
    slug: "leash-flat-handle",
    title: "Поводок с плоской ручкой",
    category: "leashes",
    pet: ["dog"],
    collection: "Поводки",
    summary: "Широкая кожаная ручка — комфортно даже с крупной собакой.",
    description: [
      "Плоская кожаная ручка распределяет нагрузку по ладони: рывок крупной собаки не врезается в руку.",
      "Ручка простёгана в два слоя и со временем принимает форму кисти.",
      "Модель для тех, кто гуляет долго и с сильной собакой.",
    ],
    // Съёмка DOGSTREET: все поводки в ней — эта модель
    images: [
      "/images/products/leash-flat-handle/1-na-bagazhnike.jpg",
      "/images/products/leash-flat-handle/2-cveta.jpg",
      "/images/products/leash-flat-handle/3-ruchka.jpg",
      "/images/products/leash-flat-handle/4-salon.jpg",
      "/images/products/leash-flat-handle/5-na-sobake.jpg",
    ],
    placeholder: "nordik",
    sizes: null,
    price: 95,
    leatherSlots: [
      { id: "outer", label: "Цвет кожи", defaultColor: "nordik" },
    ],
    hardware: true,
    engraving: null,
    customFit: null,
    productionDays: 7,
    productionDaysMax: 10,
  },

  {
    slug: "holder-croissant",
    title: "Холдер «Круассан»",
    category: "accessories",
    pet: ["dog", "cat"],
    collection: "Мелочи",
    summary: "Кожаный холдер для пакетов, который крепится прямо на поводок.",
    description: [
      "Компактный холдер для гигиенических пакетов — пристёгивается к поводку или к сумке и не болтается на ходу.",
      "Из тех же обрезков кожи, что и основная линейка: каждый холдер получается в своём цвете.",
      "Приятный маленький подарок владельцу собаки.",
    ],
    images: [],
    placeholder: "taxi",
    sizes: null,
    price: 70,
    leatherSlots: [{ id: "outer", label: "Цвет кожи", defaultColor: "taxi" }],
    hardware: true,
    engraving: null,
    customFit: null,
    productionDays: 7,
    productionDaysMax: 10,
  },
]);
