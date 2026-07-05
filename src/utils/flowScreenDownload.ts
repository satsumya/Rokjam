import { Image, Linking, Platform } from 'react-native';

import { FLOW_SCREEN_IMAGES } from '../constants/flowScreenImages';
import { getScreenManifest } from '../constants/flowMapManifest';

function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function compactSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** Base name without version — avoids redundant label + screenId (e.g. welcome-welcome → welcome). */
export function captureBaseName(screenId: string, label: string) {
  const slug = slugify(label);
  if (!slug) return screenId;

  const normSlug = compactSlug(slug);
  const normId = compactSlug(screenId);

  if (slug === screenId || normSlug === normId) return screenId;
  if (screenId.startsWith(`${slug}-`)) return screenId;
  if (normId.startsWith(normSlug) && normId.length > normSlug.length) return screenId;

  return `${slug}-${screenId}`;
}

function captureFilename(screenId: string, label: string) {
  const version = getScreenManifest(screenId)?.version ?? '0.0.0';
  return `${captureBaseName(screenId, label)}-v${version}.png`;
}

function bulkZipFilename(zipName: string, flowVersion?: string) {
  const version = flowVersion ?? '0.0.0';
  const base = compactSlug(zipName) || 'flowscreens';
  return `${base}-v${version}.zip`;
}

function triggerBrowserDownload(blobUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadOnWeb(uri: string, filename: string) {
  const response = await fetch(uri, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to fetch screenshot (${response.status})`);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  try {
    triggerBrowserDownload(blobUrl, filename);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

/** Same-origin static path (see public/flow-screens and capture script). */
function publicScreenUri(screenId: string) {
  if (typeof window === 'undefined') return null;
  return `${window.location.origin}/flow-screens/${screenId}.png`;
}

function bundledAssetUri(source: number): string | null {
  const resolve = Image.resolveAssetSource as
    | ((asset: number) => { uri: string } | undefined)
    | undefined;
  if (typeof resolve !== 'function') return null;
  return resolve(source)?.uri ?? null;
}

export async function downloadFlowScreenCapture(screenId: string, label: string) {
  if (!FLOW_SCREEN_IMAGES[screenId]) return;

  const filename = captureFilename(screenId, label);

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const uri = publicScreenUri(screenId);
    if (!uri) return;

    try {
      await downloadOnWeb(uri, filename);
    } catch {
      window.open(uri, '_blank', 'noopener,noreferrer');
    }
    return;
  }

  const uri = bundledAssetUri(FLOW_SCREEN_IMAGES[screenId]);
  if (uri) Linking.openURL(uri);
}

export async function downloadFlowScreensBulk(
  items: { screenId: string; label: string }[],
  zipName: string,
  flowVersion?: string,
) {
  const downloadable = items.filter((item) => FLOW_SCREEN_IMAGES[item.screenId]);
  if (!downloadable.length) return;

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const item of downloadable) {
      const uri = publicScreenUri(item.screenId);
      if (!uri) continue;

      const response = await fetch(uri, { cache: 'no-cache' });
      if (!response.ok) continue;

      const blob = await response.blob();
      zip.file(captureFilename(item.screenId, item.label), blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const blobUrl = URL.createObjectURL(zipBlob);
    try {
      triggerBrowserDownload(blobUrl, bulkZipFilename(zipName, flowVersion));
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
    return;
  }

  for (const item of downloadable) {
    await downloadFlowScreenCapture(item.screenId, item.label);
  }
}
