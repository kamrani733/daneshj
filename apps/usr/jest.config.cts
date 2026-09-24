const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

/** Jest patterns from apps/usr/tsconfig.json `compilerOptions.paths`. */
function moduleNameMapperFromTsconfig(tsconfigPath) {
  const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
  const paths = tsconfig.compilerOptions?.paths ?? {};
  const mapper = {};

  for (const [alias, targets] of Object.entries(paths)) {
    const target = Array.isArray(targets) ? targets[0] : undefined;
    if (!target) continue;

    const pattern = `^${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '(.*)')}$`;
    const relativeTarget = target.replace(/^\.\//, '');
    mapper[pattern] = `<rootDir>/${relativeTarget.replace(/\*$/, '$1')}`;
  }

  return mapper;
}

const config = {
  displayName: '@daneshjoam/usr',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Jest 30's Nx resolver does not fall back to tsconfig paths, and this
  // config turns off SWC path mapping. Paths stay in tsconfig.json only.
  moduleNameMapper: moduleNameMapperFromTsconfig(
    join(__dirname, 'tsconfig.json'),
  ),
  coverageDirectory: '../../coverage/apps/usr',
  testEnvironment: 'jsdom',
};

const jestConfig = createJestConfig(config);

module.exports = async () => {
  const resolved = await jestConfig();
  // Disable SWC path alias resolution — handled by Nx jest resolver.
  for (const value of Object.values(resolved.transform)) {
    if (Array.isArray(value) && value[1]?.resolvedBaseUrl) {
      value[1] = { ...value[1], resolvedBaseUrl: undefined };
    }
  }
  return resolved;
};
