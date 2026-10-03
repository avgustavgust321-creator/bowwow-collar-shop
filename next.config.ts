import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF на треть легче WebP при том же качестве; кто не умеет — получит WebP
    formats: ["image/avif", "image/webp"],
    // Меньше ступеней ширины — меньше разных вариантов одного фото.
    // Бесплатный лимит Cloudflare Images — 5000 вариантов в месяц;
    // исходники всё равно не шире 1200 px (видео и фон не в счёт)
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  async redirects() {
    return [
      // Коллекции объединены с каталогом: почти в каждой было по одному
      // изделию, и страница выглядела пустой копией каталога
      { source: "/collections", destination: "/catalog", permanent: true },
    ];
  },
};

export default nextConfig;

// В режиме разработки даёт доступ к настройкам Cloudflare (как на сервере)
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
