import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для GitHub Pages фронтенд собирается в полностью статический сайт.
  output: "export",
  // Для project site GitHub Actions передаёт NEXT_PUBLIC_BASE_PATH.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: {
    // Оптимизатор изображений Next.js требует сервер, которого нет на Pages.
    unoptimized: true,
  },
};

export default nextConfig;
