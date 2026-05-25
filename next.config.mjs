/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Статический экспорт — приложение собирается в папку `out/`,
  // которую можно открыть на любом компьютере без Node.js (через любой статический хостинг)
  output: "export",
  // SSG не использует Image Optimization
  images: { unoptimized: true },
  // Делаем URL'ы вида /week/m1-w1/ → надёжнее работают на статических хостингах
  trailingSlash: true,
};

export default nextConfig;
