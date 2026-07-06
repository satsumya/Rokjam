import { Image, Linking, Platform } from 'react-native';

import type { FlowMapPlacement } from '../constants/flowMap';
import { FLOW_SCREEN_IMAGES } from '../constants/flowScreenImages';
import { getScreenManifest } from '../constants/flowMapManifest';
import { compareFlowPlacements } from '../constants/flowMap';
import { formatFlowScreenDownloadFilename } from './flowScreenNaming';

export type FlowScreenDownloadInput = {
  screenId: string;
  label: string;
  descriptors?: string[];
  downloadTag?: string;
  downloadDescriptors?: string[];
  placement?: FlowMapPlacement;
};

function captureFilename(item: FlowScreenDownloadInput) {
  const version = getScreenManifest(item.screenId)?.version ?? '0.0.0';
  return formatFlowScreenDownloadFilename(
    item.label,
    item.downloadDescriptors ?? item.descriptors ?? [],
    version,
    { placement: item.placement, downloadTag: item.downloadTag },
  );
}

function bulkZipFilename(zipName: string, flowVersion?: string) {
  const version = flowVersion ?? '0.0.0';
  const base = zipName.trim().replace(/\s+/g, '-') || 'flow-screens';
  return `${base}--v${version}.zip`;
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

export async function downloadFlowScreenCapture(item: FlowScreenDownloadInput) {
  if (!FLOW_SCREEN_IMAGES[item.screenId]) return;

  const filename = captureFilename(item);

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const uri = publicScreenUri(item.screenId);
    if (!uri) return;

    try {
      await downloadOnWeb(uri, filename);
    } catch {
      window.open(uri, '_blank', 'noopener,noreferrer');
    }
    return;
  }

  const uri = bundledAssetUri(FLOW_SCREEN_IMAGES[item.screenId]);
  if (uri) Linking.openURL(uri);
}

export async function downloadFlowScreensBulk(
  items: FlowScreenDownloadInput[],
  zipName: string,
  flowVersion?: string,
) {
  const downloadable = items
    .filter((item) => FLOW_SCREEN_IMAGES[item.screenId])
    .sort((a, b) => {
      if (!a.placement || !b.placement) return 0;
      return compareFlowPlacements(a.placement, b.placement);
    });

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
      zip.file(captureFilename(item), blob);
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
    await downloadFlowScreenCapture(item);
  }
}
