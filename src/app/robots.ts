import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Корзина, оформление и страницы заказов не нужны в поиске
      disallow: ["/cart", "/checkout", "/order/", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
