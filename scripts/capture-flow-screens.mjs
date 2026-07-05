/**
 * Capture all prototype screen PNGs for the flow map.
 * Requires: dev server on http://localhost:8081
 * Run: npm run capture-flow-screens [-- --bump patch]
 */
import { captureFlowScreens, loadScreenList } from './capture-flow-screen-lib.mjs';

function parseBumpLevel(argv) {
  const idx = argv.indexOf('--bump');
  if (idx === -1) return null;
  const level = argv[idx + 1];
  if (!level || !['patch', 'minor', 'major'].includes(level)) {
    throw new Error('Usage: --bump patch|minor|major');
  }
  return level;
}

async function main() {
  const screens = loadScreenList();
  const bumpLevel = parseBumpLevel(process.argv);

  const result = await captureFlowScreens({
    screenIds: screens.map((s) => s.id),
    bumpLevel,
  });

  for (const screen of result.screens) {
    console.log(`Captured ${screen.id}… ${screen.width}×${screen.height}`);
  }

  console.log(`Saved ${result.screens.length} screens to assets/flow-screens/ and public/flow-screens/`);
  console.log(`Updated flow map manifest timestamps${bumpLevel ? ` (screens bumped ${bumpLevel})` : ''}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
