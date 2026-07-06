/** Flow map screen naming — see docs/tickets/Standards.md § Flow map screen names. */

import type { FlowMapPlacement } from '../constants/flowMap';
import { formatFlowPlacement } from '../constants/flowMap';

export function formatFlowScreenDisplayName(
  label: string,
  descriptors: string[] = [],
  tag?: string,
) {
  const parts = tag ? [label, tag, ...descriptors] : [label, ...descriptors];
  if (parts.length === 1) return parts[0];
  return parts.join(' | ');
}

function downloadSegment(text: string) {
  return text.trim().replace(/\s+/g, '-');
}

export type FlowScreenDownloadOptions = {
  placement?: FlowMapPlacement;
  downloadTag?: string;
};

/** Basename for PNG downloads, without extension. */
export function formatFlowScreenDownloadBasename(
  label: string,
  descriptors: string[] = [],
  version: string,
  options: FlowScreenDownloadOptions = {},
) {
  const order = options.placement ? `${formatFlowPlacement(options.placement)}-` : '';
  const tag = options.downloadTag ? `[${options.downloadTag}]-` : '';
  const parts = [label, ...descriptors].map(downloadSegment).filter(Boolean);
  return `${order}${tag}${parts.join('--')}--v${version}`;
}

export function formatFlowScreenDownloadFilename(
  label: string,
  descriptors: string[] = [],
  version: string,
  options: FlowScreenDownloadOptions = {},
) {
  return `${formatFlowScreenDownloadBasename(label, descriptors, version, options)}.png`;
}
