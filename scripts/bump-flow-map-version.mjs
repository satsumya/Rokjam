/**
 * Bump flow map version numbers.
 *
 * Examples:
 *   node scripts/bump-flow-map-version.mjs --screen welcome --level patch
 *   node scripts/bump-flow-map-version.mjs --flow sign-up-login --level minor
 *   node scripts/bump-flow-map-version.mjs --screens welcome,login --level patch
 */
import {
  loadManifest,
  saveManifest,
  touchEntry,
} from './flow-map-manifest-utils.mjs';

function parseArgs(argv) {
  const args = { screens: [], flows: [], level: null };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--screen' && argv[i + 1]) {
      args.screens.push(argv[++i]);
    } else if (arg === '--screens' && argv[i + 1]) {
      args.screens.push(...argv[++i].split(',').map((s) => s.trim()).filter(Boolean));
    } else if (arg === '--flow' && argv[i + 1]) {
      args.flows.push(argv[++i]);
    } else if (arg === '--flows' && argv[i + 1]) {
      args.flows.push(...argv[++i].split(',').map((s) => s.trim()).filter(Boolean));
    } else if (arg === '--level' && argv[i + 1]) {
      args.level = argv[++i];
    }
  }

  return args;
}

function main() {
  const { screens, flows, level } = parseArgs(process.argv);

  if (!level || !['patch', 'minor', 'major'].includes(level)) {
    console.error('Usage: --level patch|minor|major plus --screen, --screens, --flow, or --flows');
    process.exit(1);
  }

  if (!screens.length && !flows.length) {
    console.error('Specify at least one --screen or --flow to bump.');
    process.exit(1);
  }

  const manifest = loadManifest();
  const at = new Date().toISOString();

  for (const id of screens) {
    const entry = manifest.screens[id];
    if (!entry) {
      console.error(`Unknown screen: ${id}`);
      process.exit(1);
    }
    touchEntry(entry, { bump: true, level, at });
    console.log(`Screen ${id}: v${entry.version} (${at})`);
  }

  for (const id of flows) {
    const entry = manifest.flows[id];
    if (!entry) {
      console.error(`Unknown flow: ${id}`);
      process.exit(1);
    }
    touchEntry(entry, { bump: true, level, at });
    console.log(`Flow ${id}: v${entry.version} (${at})`);
  }

  saveManifest(manifest);
}

main();
