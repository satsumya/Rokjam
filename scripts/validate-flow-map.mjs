/**
 * Validate flow map manifest, screens list, PNG assets, and flowMap.ts stay in sync.
 * Run: node scripts/validate-flow-map.mjs [--fix]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  assetsScreensDir,
  captureScreensPath,
  ensureManifestEntry,
  flowMapPath,
  flowScreenImagesPath,
  loadManifest,
  parseFlowMapJourneys,
  parseFlowMapScreens,
  parseFlowScreenImageIds,
  parseScenarioFlowDocs,
  parseScenarioFlowIds,
  saveManifest,
} from './flow-map-manifest-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scenariosPath = path.join(__dirname, '../src/constants/scenarios.ts');
const flowSpecsDir = path.join(__dirname, '../docs/tickets/Flow');

const fix = process.argv.includes('--fix');

function fail(messages) {
  for (const msg of messages) console.error(`✗ ${msg}`);
  if (fix && messages.some((m) => m.startsWith('Added'))) {
    console.log('Re-run without --fix to confirm.');
    process.exit(0);
  }
  process.exit(messages.length ? 1 : 0);
}

function main() {
  const manifest = loadManifest();
  const flowMapContent = fs.readFileSync(flowMapPath, 'utf8');
  const imagesContent = fs.readFileSync(flowScreenImagesPath, 'utf8');
  const captureScreens = JSON.parse(fs.readFileSync(captureScreensPath, 'utf8'));

  const mapScreens = parseFlowMapScreens(flowMapContent);
  const journeys = parseFlowMapJourneys(flowMapContent);
  const imageIds = parseFlowScreenImageIds(imagesContent);
  const captureIds = captureScreens.map((s) => s.id);
  const pngIds = fs.existsSync(assetsScreensDir)
    ? fs.readdirSync(assetsScreensDir).filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, ''))
    : [];

  const errors = [];
  const now = new Date().toISOString();
  let changed = false;

  for (const id of mapScreens) {
    if (ensureManifestEntry(manifest, 'screens', id, now)) {
      errors.push(`Added missing manifest screen entry: ${id}`);
      changed = true;
    }
  }

  for (const id of Object.keys(journeys)) {
    if (ensureManifestEntry(manifest, 'flows', id, now)) {
      errors.push(`Added missing manifest flow entry: ${id}`);
      changed = true;
    }
  }

  for (const id of captureIds) {
    if (!mapScreens.includes(id)) {
      errors.push(`Capture screen "${id}" is not in FLOW_MAP_SCREENS`);
    }
    if (!imageIds.includes(id)) {
      errors.push(`Capture screen "${id}" is missing from flowScreenImages.ts`);
    }
    if (!pngIds.includes(id)) {
      errors.push(`Capture screen "${id}" has no PNG in assets/flow-screens/`);
    }
  }

  for (const id of imageIds) {
    if (!captureIds.includes(id)) {
      errors.push(`flowScreenImages entry "${id}" is not in flow-map-screens.json`);
    }
    if (!mapScreens.includes(id)) {
      errors.push(`flowScreenImages entry "${id}" is not in FLOW_MAP_SCREENS`);
    }
  }

  for (const [flowId, screenIds] of Object.entries(journeys)) {
    for (const id of screenIds) {
      if (!mapScreens.includes(id)) {
        errors.push(`Journey "${flowId}" references unknown screen "${id}"`);
      }
    }
  }

  const orphanManifestScreens = Object.keys(manifest.screens).filter((id) => !mapScreens.includes(id));
  for (const id of orphanManifestScreens) {
    errors.push(`Manifest screen "${id}" is not in FLOW_MAP_SCREENS`);
  }

  const orphanManifestFlows = Object.keys(manifest.flows).filter((id) => !journeys[id]);
  for (const id of orphanManifestFlows) {
    errors.push(`Manifest flow "${id}" is not in FLOW_MAP_JOURNEYS`);
  }

  const scenarioFlowIds = parseScenarioFlowIds(scenariosPath);
  const scenarioDocs = parseScenarioFlowDocs(scenariosPath);
  const journeyIds = Object.keys(journeys);

  for (const flowId of scenarioFlowIds) {
    if (!journeyIds.includes(flowId)) {
      errors.push(`SCENARIO_FLOWS id "${flowId}" has no FLOW_MAP_JOURNEYS entry`);
    }
  }

  for (const flowId of journeyIds) {
    if (!scenarioFlowIds.includes(flowId)) {
      errors.push(`FLOW_MAP_JOURNEYS id "${flowId}" is not in SCENARIO_FLOWS`);
    }
  }

  if (fs.existsSync(flowSpecsDir)) {
    const specFiles = fs
      .readdirSync(flowSpecsDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, ''));

    for (const flowId of scenarioFlowIds) {
      const doc = scenarioDocs[flowId];
      if (doc && !specFiles.includes(doc)) {
        errors.push(`Flow spec docs/tickets/Flow/${doc}.md is missing for "${flowId}"`);
      }
    }
  }

  if (changed && fix) {
    saveManifest(manifest);
  }

  if (errors.length === 0) {
    console.log('Flow map manifest, screens, and assets are in sync.');
    process.exit(0);
  }

  if (fix && changed) {
    console.log('Fixed manifest entries. Remaining issues:');
  }

  fail(errors);
}

main();
