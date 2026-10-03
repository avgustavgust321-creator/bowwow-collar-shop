import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF на треть легче WebP при том же качестве; кто не умеет — получит WebP
    formats: ["image/avif", "image/webp"],
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
