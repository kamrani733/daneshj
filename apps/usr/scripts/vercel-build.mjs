import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Preview defaults — match `apps/usr/.env.example` and `vercel.json`. Dashboard env wins when set. */
const VERCEL_BUILD_DEFAULTS = {
  NEXT_PUBLIC_API_URL: 'http://dev.stella.webpanel.systems:3009',
  AUTH_API_URL: 'http://dev.stella.webpanel.systems:3009',
  NEXT_PUBLIC_NOTIFICATION_API_URL: '/api',
  NOTIFICATION_API_URL: 'http://dev.stella.webpanel.systems:4002',
  NEXT_PUBLIC_INTERACTIVE_OPS_API_URL: '/api',
  INTERACTIVE_OPS_API_URL: 'http://dev.stella.webpanel.systems:5001',
  NEXT_PUBLIC_ACTOR_API_URL: '/api',
  ACTOR_API_URL: 'http://dev.stella.webpanel.systems:3008',
};

function applyVercelBuildDefaults() {
  if (process.env.VERCEL !== '1') {
    return;
  }
  for (const [key, value] of Object.entries(VERCEL_BUILD_DEFAULTS)) {
    if (!process.env[key]?.trim()) {
      process.env[key] = value;
    }
  }
}

applyVercelBuildDefaults();

const result = spawnSync('pnpm', ['exec', 'next', 'build'], {
  cwd: appRoot,
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
