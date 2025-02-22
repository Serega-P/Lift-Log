/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  ...pwaConfig,
  reactStrictMode: true,
};

export default nextConfig;