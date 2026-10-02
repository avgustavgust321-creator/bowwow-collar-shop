/**
 * Общие данные сайта: навигация, контакты, реквизиты.
 * Всё, что нужно поправить перед запуском, помечено ЗАПОЛНИТЬ.
 */

export const site = {
  name: "BOW WOW COLLAR",
  tagline: "Кожаная амуниция ручной работы",
  description:
    "Ошейники, шлейки и поводки из натуральной кожи ручной работы. " +
    "12 цветов кожи, латунная фурнитура, индивидуальные размеры и гравировка.",
  url: "https://bowwow.by", // ЗАПОЛНИТЬ: реальный домен
  currency: "BYN",
  city: "Брест",

  contacts: {
    instagram: "https://www.instagram.com/bow_wow_collar/",
    instagramHandle: "@bow_wow_collar",
    /** Прямая ссылка в личные сообщения — открывает переписку с брендом */
    instagramDirect: "https://ig.me/m/bow_wow_collar",
    telegram: "https://t.me/bowwow", // ЗАПОЛНИТЬ
    phone: "+375 (__) ___-__-__", // ЗАПОЛНИТЬ
    email: "hello@bowwow.by", // ЗАПОЛНИТЬ
    /** Переключить в true, когда адрес почты подтверждён — до этого подвал его не показывает */
    emailConfirmed: false,
  },

  /** Реквизиты для юридических страниц и подвала */
  legal: {
    entity: "ИП ЗАПОЛНИТЬ",
    unp: "ЗАПОЛНИТЬ",
    registry: "ЗАПОЛНИТЬ: дата и номер записи в Торговом реестре РБ",
    address: "ЗАПОЛНИТЬ",
  },
} as const;

export const mainNav = [
  { href: "/catalog", label: "Каталог" },
  { href: "/collections", label: "Коллекции" },
  { href: "/sizing", label: "Как замерить" },
  { href: "/dogs", label: "Собаки" },
  { href: "/about", label: "О бренде" },
  { href: "/faq", label: "Вопросы" },
] as const;

export const footerNav = [
  {
    title: "Магазин",
    links: [
      { href: "/catalog?category=collars", label: "Ошейники" },
      { href: "/catalog?category=harnesses", label: "Шлейки" },
      { href: "/catalog?category=leashes", label: "Поводки" },
      { href: "/catalog?category=accessories", label: "Аксессуары" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { href: "/sizing", label: "Как замерить питомца" },
      { href: "/care", label: "Уход за кожей" },
      { href: "/delivery", label: "Доставка и оплата" },
      { href: "/faq", label: "Частые вопросы" },
    ],
  },
  {
    title: "Бренд",
    links: [
      { href: "/about", label: "О мастерской" },
      { href: "/dogs", label: "Собаки" },
      { href: "/collections", label: "Коллекции" },
      { href: "/offer", label: "Публичная оферта" },
      { href: "/policy", label: "Обработка данных" },
    ],
  },
] as const;
