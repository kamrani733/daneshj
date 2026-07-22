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
  async redirects() {
    return [
      {
        source: '/register',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/register/:path*',
        destination: '/login/:path*',
        permanent: false,
      },
    ];
  },
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
