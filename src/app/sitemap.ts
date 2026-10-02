import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { listedProducts as products } from "@/lib/catalog";

const staticPaths = [
  "",
  "/catalog",
  "/sizing",
  "/care",
  "/delivery",
  "/faq",
  "/about",
  "/dogs",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
    })),
    ...products.map((product) => ({
      url: `${site.url}/product/${product.slug}`,
      lastModified: now,
    })),
  ];
}
