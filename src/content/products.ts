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
 *   5. Фотографии: класть в папку товара внутри public/images/tovary/
 *      (какая папка у какого товара — поле photos). Подключаются сами,
 *      правила — в public/images/tovary/_КАК-ДОБАВЛЯТЬ-ФОТО.txt.
 *   6. Тексты описаний написаны как черновик по материалам
 *      инстаграма — перечитайте и поправьте под свой голос.
 * ═══════════════════════════════════════════════════════════════
 */

import { withPhotos } from "@/lib/photos";
import { validateCatalog } from "@/lib/product-schema";

const catalog = [
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
    photos: "1-oshejniki/s-podkladom",
    placeholder: "pepa",
    sizes: [
      { code: "XS", note: "обхват шеи 21–26 см", price: 90 },
      { code: "S", note: "25–31 см", price: 110 },
      { code: "M", note: "30–36 см", price: 130 },
      { code: "L", note: "35–43 см", price: 140 },
      { code: "XL", note: "42–50 см", price: 150 },
      // Big Boss — на 10 р. дороже XL. Размер открыт сверху, поэтому
      // шьём по обхвату шеи конкретной собаки
      {
        code: "Big Boss",
        price: 160,
        note: "от 50 см, усиленная фурнитура",
        measure: ["neck"],
      },
    ],
    price: null,
    leatherSlots: [
      // Верх у этой модели всегда коньячный — выбирается только подклад.
      { id: "outer", label: "Основная кожа", defaultColor: "chocolate", fixed: true },
      { id: "lining", label: "Цвет подклада", defaultColor: "tiffani" },
    ],
    hardware: true,
    engraving: { maxChars: 25, price: 10, label: "Гравировка на ремне" },
    customFit: null,
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
    photos: "1-oshejniki/odnotonnye",
    placeholder: "amster",
    sizes: [
      { code: "XS", note: "обхват шеи 21–26 см", price: 65 },
      { code: "S", note: "25–31 см", price: 75 },
      { code: "M", note: "30–36 см", price: 80 },
      { code: "L", note: "35–43 см", price: 90 },
      { code: "XL", note: "42–50 см", price: 110 },
      {
        code: "Big Boss",
        price: 120,
        note: "от 50 см, усиленная фурнитура",
        measure: ["neck"],
      },
    ],
    price: null,
    leatherSlots: [{ id: "outer", label: "Цвет кожи", defaultColor: "amster" }],
    hardware: true,
    engraving: { maxChars: 25, price: 10, label: "Гравировка на ремне" },
    customFit: null,
    productionDays: 7,
    productionDaysMax: 10,
  },

  {
    // Заказной ошейник: конструктора и корзины нет, всё обсуждается
    // в личке инстаграма. Цены по размерам — ориентир «от».
    // Фото — ошейники, которые уже шились по индивидуальным заказам.
    slug: "collar-custom",
    title: "Ошейник по вашей идее",
    category: "collars",
    pet: ["dog", "cat"],
    collection: "На заказ",
    badge: "В одном экземпляре",
    summary:
      "Замша, два цвета, фигурные вставки, тиснение — сошьём ошейник, которого нет в каталоге.",
    description: [
      "Каталог — это то, что мы шьём чаще всего. Но кожа позволяет больше: широкий ошейник для борзой, замша с фигурной вставкой, два цвета встык, клетчатый подклад, тиснение имени.",
      "Пришлите нам в инстаграм фото-референс или опишите идею словами — там обсудим материал, цвета, размер и назовём точную цену.",
      "Размер — по сетке или по вашим замерам, фурнитура — латунная или серебряного цвета. Шьём из той же итальянской кожи, что и всю линейку.",
    ],
    photos: "1-oshejniki/na-zakaz",
    placeholder: "taxi",
    // Стартовые цены — как у ошейника с подкладом, с пометкой «от»:
    // точную сумму мастер называет в переписке.
    sizes: [
      { code: "XS", note: "обхват шеи 21–26 см", price: 90, from: true },
      { code: "S", note: "25–31 см", price: 110, from: true },
      { code: "M", note: "30–36 см", price: 130, from: true },
      { code: "L", note: "35–43 см", price: 140, from: true },
      { code: "XL", note: "42–50 см", price: 150, from: true },
      { code: "Big Boss", note: "от 50 см, усиленная фурнитура", price: 150, from: true },
    ],
    price: null,
    leatherSlots: [],
    hardware: false,
    engraving: null,
    customFit: null,
    viaInstagram: true,
    productionDays: 7,
    productionDaysMax: 10, // ЗАПОЛНИТЬ, если заказные шьются дольше
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
    photos: "2-shlejki/na-chetyre-pryazhki",
    placeholder: "narnia",
    sizes: [
      { code: "Small", note: "до 2,5 кг", price: 150 },
      { code: "Medium", note: "до 12 кг", price: 175 },
      { code: "Large", note: "без ограничения по весу", price: 229 },
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
    photos: "3-povodki/lap",
    placeholder: "opera",
    sizes: null,
    price: 99,
    leatherSlots: [
      // Обмотка — из той же кожи, что ошейники
      { id: "outer", label: "Цвет кожаной обмотки", defaultColor: "nordik" },
    ],
    length: { base: 1.3, step: 1, pricePerStep: 5, maxSteps: 3 },
    // ЗАПОЛНИТЬ: цвета шнура — владелец пришлёт, тогда это станет выбором
    configNote:
      "Цвета шнура скоро появятся здесь. Пока напишите желаемый цвет в комментарии к заказу — или посмотрите варианты в инстаграме в актуальном.",
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
    photos: "3-povodki/perestezhka",
    placeholder: "titanik",
    sizes: null,
    price: 80,
    // ЗАПОЛНИТЬ: цвета шнура и обмотки — владелец пришлёт, тогда
    // они станут выбором вместо пояснения ниже
    leatherSlots: [],
    length: { base: 2.7, step: 1, pricePerStep: 5, maxSteps: 3 },
    configNote:
      "Цвета шнура и обмотки скоро появятся здесь. Пока напишите желаемые в комментарии к заказу — или посмотрите варианты в инстаграме в актуальном.",
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
    photos: "3-povodki/s-ploskoj-ruchkoj",
    placeholder: "nordik",
    sizes: null,
    price: 95,
    leatherSlots: [
      // Снаружи ручка всегда шоколадная, выбирается кожа внутри
      { id: "outer", label: "Кожа снаружи", defaultColor: "chocolate", fixed: true },
      { id: "inner", label: "Цвет кожи внутри ручки", defaultColor: "matrica" },
    ],
    length: { base: 1.3, step: 1, pricePerStep: 5, maxSteps: 3 },
    // ЗАПОЛНИТЬ: коричневый шнур — когда владелец пришлёт фото, добавить выбор
    configNote:
      "Шнур бежевый, скоро добавим коричневый. Хотите другой цвет из наличия — обсудим в инстаграме.",
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
      "Шьётся из коричневой кожи — той же, что и основная линейка.",
      "Приятный маленький подарок владельцу собаки.",
    ],
    photos: "4-aksessuary/holder-kruassan",
    placeholder: "taxi",
    sizes: null,
    price: 70,
    // Холдер шьётся только в одном цвете — коричневом
    leatherSlots: [
      { id: "outer", label: "Цвет кожи", defaultColor: "chocolate", fixed: true },
    ],
    hardware: false, // фурнитура у холдера одна, выбирать нечего
    engraving: null,
    customFit: null,
    productionDays: 7,
    productionDaysMax: 10,
  },
  {
    slug: "bowl",
    title: "Миска с надписью",
    category: "bowls",
    pet: ["dog", "cat"],
    collection: "Миски",
    badge: "Новинка",
    summary:
      "Печатается на 3D-принтере под заказ: свой цвет, своя надпись по кругу.",
    description: [
      "Корпус миски печатается на 3D-принтере, внутри — чаша из нержавеющей стали. Еда и вода касаются только стали.",
      "Надпись идёт рельефным поясом по кругу. Текст любой — кличка, фраза, шутка, — цвет надписи и цвет самой миски выбираете из 25 оттенков.",
      "Три объёма: 250, 500 и 800 мл.",
    ],
    photos: "5-miski/miska",
    placeholder: "pepa",
    // ЗАПОЛНИТЬ: цены. Пока их нет, товар в режиме черновика (draft) —
    // открывается по прямой ссылке, но не виден в каталоге и на главной.
    sizes: [
      { code: "250 мл", price: 1 },
      { code: "500 мл", price: 1 },
      { code: "800 мл", price: 1 },
    ],
    price: null,
    leatherSlots: [
      { id: "base", label: "Цвет миски", palette: "plastic" as const, defaultColor: "rozovyj" },
      { id: "text", label: "Цвет надписи", palette: "plastic" as const, defaultColor: "oliva" },
    ],
    hardware: false,
    engraving: {
      maxChars: 30, // ЗАПОЛНИТЬ: сколько знаков помещается по кругу
      price: 0,
      label: "Надпись на миске",
      placeholder: "Например, «Марта. Не делиться»",
      colorSlot: "text",
    },
    customFit: null,
    productionDays: 7, // ЗАПОЛНИТЬ: реальный срок печати
    productionDaysMax: 10,
    livePreview: "bowl" as const,
    draft: true,
  },
];

export const products = validateCatalog(catalog.map(withPhotos));
