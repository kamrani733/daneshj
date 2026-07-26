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
    /** @type {{ source: string, destination: string }[]} */
    const rules = [];

    const authBackend = process.env.AUTH_API_URL;
    if (authBackend) {
      const base = authBackend.replace(/\/$/, '');
      rules.push({
        source: '/api/auth/:path*',
        destination: `${base}/auth/:path*`,
      });
    }

    const notificationBackend = process.env.NOTIFICATION_API_URL;
    if (notificationBackend) {
      const base = notificationBackend.replace(/\/$/, '');
      rules.push({
        source: '/api/notification/:path*',
        destination: `${base}/notification/:path*`,
      });
    }

    return rules;
  },
};

module.exports = withNextIntl(nextConfig);
