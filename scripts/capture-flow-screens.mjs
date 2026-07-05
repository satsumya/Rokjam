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
    console.log(
      `Captured ${screen.id}… ${screen.width}×${screen.height}${screen.changed ? ' (changed)' : ' (unchanged)'}`,
    );
  }

  const changedCount = result.changedScreenIds?.length ?? 0;
  console.log(`Saved ${result.screens.length} screens to assets/flow-screens/ and public/flow-screens/`);
  if (bumpLevel) {
    console.log(`Bumped all captured screens and flows (${bumpLevel}).`);
  } else if (changedCount > 0) {
    console.log(`Auto-bumped patch version for ${changedCount} changed screen(s) and affected flow(s).`);
  } else {
    console.log('No visual changes — versions unchanged.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
