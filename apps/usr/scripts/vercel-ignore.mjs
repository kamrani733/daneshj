import { execFileSync } from 'node:child_process';

/**
 * Vercel Ignored Build Step. Exit 0 skips the deploy, 1 continues.
 * Only `apps/usr` plus its workspace graph should trigger this project.
 */
const WATCHED_PATHS = [
  'apps/usr',
  'libs',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'nx.json',
  'tsconfig.base.json',
  'tsconfig.json',
  'vercel.json',
  '.vercelignore',
];

function repoRoot() {
  return execFileSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
  }).trim();
}

try {
  const cwd = repoRoot();
  const previous = process.env.VERCEL_GIT_PREVIOUS_SHA?.trim();
  // A missing or unfetched base means we cannot prove the app is unchanged.
  if (!previous) process.exit(1);

  try {
    execFileSync('git', ['cat-file', '-e', `${previous}^{commit}`], {
      cwd,
      stdio: 'ignore',
    });
  } catch {
    process.exit(1);
  }

  execFileSync('git', ['diff', '--quiet', previous, 'HEAD', '--', ...WATCHED_PATHS], {
    cwd,
    stdio: 'ignore',
  });
  process.exit(0);
} catch {
  process.exit(1);
}
