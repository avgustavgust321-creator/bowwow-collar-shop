import type { Metadata } from "next";
import { Comforter, Montserrat, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/ui/header-3";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";
import "./globals.css";

/** Высококонтрастная антиква на заголовки — голос бренда. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Геометрический гротеск: текст, формы, таблицы и метки вразрядку. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/**
 * Скрипт на короткие акцентные надписи.
 * Единственное начертание — 400; других у семейства нет.
 */
const comforter = Comforter({
  variable: "--font-comforter",
  subsets: ["cyrillic", "latin"],
  weight: ["400"],
  display: "swap",
  // Рукописные подписи — украшение, не текст. Не грузим их в первую
  // очередь: на медленном канале они отнимали полосу у фото и страницы
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // Главная — с тем, что ищут: «кожаные ошейники для собак ручной работы»
    default: `Кожаные ошейники и шлейки для собак ручной работы — ${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  // Канонический адрес задаёт каждая страница сама: здесь он унаследовался
  // бы всеми страницами, и поисковик счёл бы их копиями главной
  openGraph: {
    type: "website",
    locale: "ru_BY",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Кожаные ошейники BOW WOW COLLAR четырёх цветов с латунными пряжками",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og.jpg"],
  },
  // Коды подтверждения прав в Яндексе и Google — пустые не выводятся
  verification: {
    ...(site.verification.google ? { google: site.verification.google } : {}),
    ...(site.verification.yandex
      ? { yandex: site.verification.yandex }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${playfair.variable} ${comforter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col text-ebony">
        <CartProvider>
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
