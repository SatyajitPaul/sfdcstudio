import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization if not needed
  },
  assetPrefix: isProd ? '/sfdcstudio/' : '',
  basePath: isProd ? '/sfdcstudio' : '',
  output: 'export',
};

export default withSerwist(nextConfig);
