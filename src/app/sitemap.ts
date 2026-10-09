import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";
import { site } from "@/content/site";
import { framesFor, listedProducts as products } from "@/lib/catalog";

/**
 * Карта сайта для Яндекса и Google.
 *
 * Разделы каталога — отдельными адресами: «кожаные ошейники для собак»
 * и «шлейки по меркам» ищут по-разному, и у каждого раздела свой
 * заголовок. У товаров — их фото, чтобы они попадали в поиск картинок.
 * Оферта и политика сюда не входят: они нужны по закону, а не для поиска.
 */
const pages: Array<{
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
}> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/catalog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/dogs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/sizing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/delivery", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/care", priority: 0.4, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const liveCategories = categories.filter((c) =>
    products.some((p) => p.category === c.id),
  );

  return [
    ...pages.map((page) => ({
      url: `${site.url}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...liveCategories.map((category) => ({
      url: `${site.url}/catalog?category=${category.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${site.url}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: framesFor(product)
        .frames.slice(0, 5)
        .map((frame) => `${site.url}${frame}`),
    })),
  ];
}
