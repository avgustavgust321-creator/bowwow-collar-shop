import type { Metadata } from "next";
import { IBM_Plex_Mono, Literata, Manrope } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { CursorDog } from "@/components/brand/CursorDog";
import { DustBackground } from "@/components/brand/DustBackground";
import { Header } from "@/components/ui/header-3";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";
import "./globals.css";

/** Антиква на заголовки, цены и сноски — голос бренда. */
const literata = Literata({
  variable: "--font-literata",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Гротеск на текст, формы и таблицы. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/** Моноширинный на служебные подписи: разделы, статусы, единицы. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["cyrillic", "latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "ru_BY",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${literata.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-night text-paper">
        <CartProvider>
          <DustBackground />
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
          <CursorDog />
        </CartProvider>
      </body>
    </html>
  );
}
