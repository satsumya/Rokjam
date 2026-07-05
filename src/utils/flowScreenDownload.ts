import { Image, Linking, Platform } from 'react-native';

import { FLOW_SCREEN_IMAGES } from '../constants/flowScreenImages';

function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
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

  const filename = `${slugify(label) || screenId}.png`;

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
