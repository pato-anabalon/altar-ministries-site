import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "mdx"],
  images: { formats: ["image/avif", "image/webp"] },
};

export default withNextIntl(withMDX(nextConfig));
