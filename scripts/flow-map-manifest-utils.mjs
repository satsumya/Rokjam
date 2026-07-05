/**
 * Read/write flow map version manifest — shared by capture, validate, and bump scripts.
 */
import crypto from 'crypto';
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

export function bumpManifestEntry(entry, level = 'patch', at = new Date().toISOString()) {
  const previousVersion = entry.version;
  entry.version = bumpVersion(entry.version, level);
  entry.updatedAt = at;
  return { previousVersion, nextVersion: entry.version, updatedAt: at };
}

export function touchEntry(entry, { bump, level, at = new Date().toISOString() } = {}) {
  if (bump && level) {
    return bumpManifestEntry(entry, level, at);
  }
  return null;
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

export function parseScenarioFlowIds(scenariosPath) {
  const content = fs.readFileSync(scenariosPath, 'utf8');
  const match = content.match(/export const SCENARIO_FLOWS[^=]*=\s*\[([\s\S]*?)\];/);
  if (!match) return [];
  return [...match[1].matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
}

export function parseScenarioFlowDocs(scenariosPath) {
  const content = fs.readFileSync(scenariosPath, 'utf8');
  const match = content.match(/export const SCENARIO_FLOWS[^=]*=\s*\[([\s\S]*?)\];/);
  if (!match) return {};
  const docs = {};
  for (const m of match[1].matchAll(/id: '([^']+)',\s*doc: '([^']+)'/g)) {
    docs[m[1]] = m[2];
  }
  return docs;
}

export function syncFlowUpdatedAt(manifest, journeyScreens, changedScreenIds = null) {
  const changed = changedScreenIds ? new Set(changedScreenIds) : null;

  for (const [flowId, screenIds] of Object.entries(journeyScreens)) {
    const entry = manifest.flows[flowId];
    if (!entry) continue;

    const relevantIds = changed ? screenIds.filter((id) => changed.has(id)) : screenIds;
    if (changed && relevantIds.length === 0) continue;

    const dates = relevantIds
      .map((id) => manifest.screens[id]?.updatedAt)
      .filter(Boolean)
      .sort();

    if (dates.length) {
      entry.updatedAt = dates[dates.length - 1];
    }
  }
}

export async function sha256File(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buf = await fs.promises.readFile(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/**
 * Bump versions only for screens whose PNG content changed.
 * Flow versions bump (patch) when any contained screen changed.
 * manualBumpLevel forces a bump on every captured screen/flow regardless of visual change.
 */
export function applyCaptureVersionBumps(
  manifest,
  journeyScreens,
  capturedScreenIds,
  changedScreenIds,
  { manualBumpLevel = null } = {},
) {
  const at = new Date().toISOString();
  const changed = new Set(changedScreenIds);
  const bumpLevel = manualBumpLevel ?? 'patch';
  const bumps = { screens: [], flows: [] };

  for (const id of capturedScreenIds) {
    ensureManifestEntry(manifest, 'screens', id, at);
    if (manualBumpLevel || changed.has(id)) {
      const result = touchEntry(manifest.screens[id], { bump: true, level: bumpLevel, at });
      if (result) bumps.screens.push({ id, ...result });
    }
  }

  for (const [flowId, screenIds] of Object.entries(journeyScreens)) {
    const flowTouched = manualBumpLevel
      ? screenIds.some((id) => capturedScreenIds.includes(id))
      : screenIds.some((id) => changed.has(id));
    if (!flowTouched) continue;

    ensureManifestEntry(manifest, 'flows', flowId, at);
    const result = touchEntry(manifest.flows[flowId], { bump: true, level: bumpLevel, at });
    if (result) bumps.flows.push({ id: flowId, ...result });
  }

  return bumps;
}

export function touchCapturedScreens(manifest, screenIds, { bump, level } = {}) {
  const at = new Date().toISOString();

  for (const id of screenIds) {
    ensureManifestEntry(manifest, 'screens', id, at);
    touchEntry(manifest.screens[id], { bump, level, at });
  }
}
