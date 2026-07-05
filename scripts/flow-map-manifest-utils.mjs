/**
 * Read/write flow map version manifest — shared by capture, validate, and bump scripts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const manifestPath = path.join(__dirname, '../src/constants/flowMapManifest.json');
export const flowMapPath = path.join(__dirname, '../src/constants/flowMap.ts');
export const flowScreenImagesPath = path.join(__dirname, '../src/constants/flowScreenImages.ts');
export const captureScreensPath = path.join(__dirname, 'flow-map-screens.json');
export const assetsScreensDir = path.join(__dirname, '../assets/flow-screens');

export function loadManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

export function saveManifest(manifest) {
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

export function bumpVersion(current, level) {
  const parts = current.split('.').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid version: ${current}`);
  }

  let [major, minor, patch] = parts;
  if (level === 'patch') patch += 1;
  else if (level === 'minor') {
    minor += 1;
    patch = 0;
  } else if (level === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else {
    throw new Error(`Unknown bump level: ${level}`);
  }

  return `${major}.${minor}.${patch}`;
}

export function touchEntry(entry, { bump, level, at = new Date().toISOString() } = {}) {
  entry.updatedAt = at;
  if (bump && level) {
    entry.version = bumpVersion(entry.version, level);
  }
  return entry;
}

export function ensureManifestEntry(manifest, kind, id, at) {
  if (!manifest[kind][id]) {
    manifest[kind][id] = { version: '0.0.0', updatedAt: at };
    return true;
  }
  return false;
}

export function parseFlowMapScreens(content) {
  const match = content.match(/export const FLOW_MAP_SCREENS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!match) return [];
  return [...match[1].matchAll(/^\s+(?:'([^']+)'|(\w+)):\s*\{/gm)].map((m) => m[1] ?? m[2]);
}

export function parseFlowMapJourneys(content) {
  const match = content.match(
    /export const FLOW_MAP_JOURNEYS[^=]*=\s*\[([\s\S]*?)\];\s*\n\s*export function resolveJourneyLayout/,
  );
  if (!match) return {};

  const journeys = {};
  const blocks = match[1].split(/\{\s*\n\s*id: '/).slice(1);

  for (const block of blocks) {
    const idMatch = block.match(/^([^']+)'/);
    if (!idMatch) continue;
    const id = idMatch[1];
    const screenIds = [...block.matchAll(/screenId: '([^']+)'/g)].map((m) => m[1]);
    journeys[id] = [...new Set(screenIds)];
  }

  return journeys;
}

export function parseFlowScreenImageIds(content) {
  return [...content.matchAll(/^\s+(?:'([^']+)'|([\w-]+)):\s*require/gm)].map((m) => m[1] ?? m[2]);
}

export function syncFlowUpdatedAt(manifest, journeyScreens) {
  const now = new Date().toISOString();

  for (const [flowId, screenIds] of Object.entries(journeyScreens)) {
    const entry = manifest.flows[flowId];
    if (!entry) continue;

    const dates = screenIds
      .map((id) => manifest.screens[id]?.updatedAt)
      .filter(Boolean)
      .sort();

    if (dates.length) {
      entry.updatedAt = dates[dates.length - 1];
    } else {
      entry.updatedAt = now;
    }
  }
}

export function touchCapturedScreens(manifest, screenIds, { bump, level } = {}) {
  const at = new Date().toISOString();

  for (const id of screenIds) {
    ensureManifestEntry(manifest, 'screens', id, at);
    touchEntry(manifest.screens[id], { bump, level, at });
  }
}
