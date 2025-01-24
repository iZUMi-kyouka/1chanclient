import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

/** @type {import('next').NextConfig} */
export default nextConfig;

module.exports = withNextIntl(nextConfig);