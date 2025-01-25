import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const nextConfig: NextConfig = {
  // output: 'export'
};

/** @type {import('next').NextConfig} */
export default withNextIntl(nextConfig);
