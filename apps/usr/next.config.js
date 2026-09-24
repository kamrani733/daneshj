//@ts-check

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

if (process.env.NODE_ENV === 'production') {
  const hasAuthUrl = Boolean(
    process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.AUTH_API_URL?.trim()
  );
  if (!hasAuthUrl) {
    throw new Error(
      'Production build requires NEXT_PUBLIC_API_URL or AUTH_API_URL.'
    );
  }
}

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

    const interactiveOpsBackend = (
      process.env.INTERACTIVE_OPS_API_URL ||
      'http://dev.stella.webpanel.systems:5001'
    ).replace(/\/$/, '');
    for (const source of [
      '/api/interactive-ops/:path*',
      '/interactive-ops/:path*',
    ]) {
      rules.push({
        source,
        destination: `${interactiveOpsBackend}/interactive-ops/:path*`,
      });
    }

    const actorBackend = process.env.ACTOR_API_URL;
    if (actorBackend) {
      const base = actorBackend.replace(/\/$/, '');
      for (const prefix of [
        'profiles_base',
        'profiles_user',
        'profiles_individual',
        'profiles_business',
        'service_titles',
      ]) {
        rules.push({
          source: `/api/${prefix}/:path*`,
          destination: `${base}/${prefix}/:path*`,
        });
      }
    }

    return rules;
  },
};

module.exports = withNextIntl(nextConfig);
