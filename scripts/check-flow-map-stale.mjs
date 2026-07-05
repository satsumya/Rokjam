/**
 * Fail when app/component files change without flow-map artifacts updating.
 * Skips when no relevant files changed (local dev) or in CI without a base ref.
 *
 * Run: node scripts/check-flow-map-stale.mjs
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const FLOW_MAP_PATTERNS = [
  /^src\/constants\/flowMap(\.|\.ts)/,
  /^src\/constants\/flowMapManifest\.json$/,
  /^src\/constants\/flowScreenImages\.ts$/,
  /^src\/constants\/flowScreenDimensions\.ts$/,
  /^scripts\/flow-map-screens\.json$/,
  /^scripts\/(validate-flow-map|capture-flow-screens|check-flow-map-stale|flow-map-manifest-utils)\.mjs$/,
  /^assets\/flow-screens\//,
  /^public\/flow-screens\//,
  /^docs\/tickets\/Flow\//,
];

const SCREEN_CHANGE_PATTERNS = [
  /^app\/(?!scenarios\.tsx$|flow-map\.tsx$|_layout\.tsx$).+\.tsx$/,
  /^src\/components\/.+\.tsx$/,
];

function matches(file, patterns) {
  return patterns.some((pattern) => pattern.test(file));
}

function gitLines(command) {
  try {
    return execSync(command, { cwd: root, encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function changedFiles() {
  if (process.env.CI === 'true' && process.env.GITHUB_BASE_REF) {
    const base = `origin/${process.env.GITHUB_BASE_REF}`;
    gitLines(`git fetch origin ${process.env.GITHUB_BASE_REF} --depth=1 2>/dev/null || true`);
    const prFiles = gitLines(`git diff --name-only ${base}...HEAD`);
    if (prFiles.length) return prFiles;
  }

  const staged = gitLines('git diff --cached --name-only');
  if (staged.length) return staged;

  return [];
}

function main() {
  const files = changedFiles();
  if (!files.length) {
    console.log('Flow map stale check: no staged/PR changes — skipped.');
    process.exit(0);
  }

  const screenChanges = files.filter((f) => matches(f, SCREEN_CHANGE_PATTERNS));
  if (!screenChanges.length) {
    console.log('Flow map stale check: no screen/component changes — ok.');
    process.exit(0);
  }

  const flowMapChanges = files.filter((f) => matches(f, FLOW_MAP_PATTERNS));
  if (flowMapChanges.length) {
    console.log('Flow map stale check: screen changes include flow-map updates — ok.');
    process.exit(0);
  }

  console.error('✗ Screen or component files changed without flow-map updates.');
  console.error('');
  console.error('Changed screens/components:');
  for (const file of screenChanges) console.error(`  - ${file}`);
  console.error('');
  console.error('Update at least one of:');
  console.error('  - src/constants/flowMap.ts');
  console.error('  - scripts/flow-map-screens.json + src/constants/flowScreenImages.ts');
  console.error('  - docs/tickets/Flow/<Flow>.md');
  console.error('  - assets/flow-screens/ (via npm run capture-flow-screens)');
  console.error('');
  console.error('Then run: npm run validate-flow-map:fix && npm run capture-flow-screens');
  console.error('See docs/tickets/Standards.md § Flow map');
  process.exit(1);
}

main();
