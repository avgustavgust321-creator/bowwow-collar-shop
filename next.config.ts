import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Коллекции объединены с каталогом: почти в каждой было по одному
      // изделию, и страница выглядела пустой копией каталога
      { source: "/collections", destination: "/catalog", permanent: true },
    ];
  },
};

export default nextConfig;
