//@ts-check

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@daneshjoam/api-client',
    '@daneshjoam/auth',
    '@daneshjoam/shared-ui',
    '@daneshjoam/shared-types',
  ],
  async rewrites() {
    const backend = process.env.AUTH_API_URL;
    if (!backend) return [];

    const base = backend.replace(/\/$/, '');
    return [
      {
        source: '/api/auth/:path*',
        destination: `${base}/auth/:path*`,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
