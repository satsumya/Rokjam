import { Platform } from 'react-native';

import type { FlowMapVersionEntry } from '../constants/flowMapManifest';

const DEFAULT_CAPTURE_SERVER = 'http://localhost:9876';

export type CaptureScreenResult = {
  id: string;
  width: number;
  height: number;
  version: string;
  updatedAt: string;
  changed?: boolean;
};

export type CaptureBumpEntry = {
  id: string;
  previousVersion: string;
  nextVersion: string;
  updatedAt: string;
};

export type CaptureBumps = {
  screens: CaptureBumpEntry[];
  flows: CaptureBumpEntry[];
};

export type CaptureFlowResult = {
  ok: boolean;
  screens: CaptureScreenResult[];
  flows: { id: string; version: string; updatedAt: string; changed?: boolean }[];
  changedScreenIds?: string[];
  bumps?: CaptureBumps;
  manifest?: { screens: Record<string, FlowMapVersionEntry>; flows: Record<string, FlowMapVersionEntry> };
  flowId?: string;
  error?: string;
};

function captureServerUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return process.env.EXPO_PUBLIC_FLOW_MAP_CAPTURE_URL ?? DEFAULT_CAPTURE_SERVER;
  }
  return DEFAULT_CAPTURE_SERVER;
}

export function flowScreenPreviewSource(screenId: string, cacheKey?: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const qs = cacheKey ? `?v=${encodeURIComponent(cacheKey)}` : '';
    return { uri: `${window.location.origin}/flow-screens/${screenId}.png${qs}` };
  }
  return null;
}

async function postCapture(path: string, body: object): Promise<CaptureFlowResult> {
  const response = await fetch(`${captureServerUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as CaptureFlowResult;
  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? `Capture failed (${response.status})`);
  }
  return data;
}

export async function captureFlowMapScreens(screenIds: string[]) {
  return postCapture('/capture/screens', { screenIds });
}

export async function captureFlowMapFlow(flowId: string) {
  return postCapture('/capture/flow', { flowId });
}

export async function fetchFlowMapManifest() {
  const response = await fetch(`${captureServerUrl()}/manifest`);
  const data = (await response.json()) as {
    ok: boolean;
    manifest?: { screens: Record<string, FlowMapVersionEntry>; flows: Record<string, FlowMapVersionEntry> };
  };
  if (!response.ok || !data.ok || !data.manifest) {
    throw new Error('Failed to load flow map manifest');
  }
  return data.manifest;
}

export async function checkFlowMapCaptureServer() {
  try {
    const response = await fetch(`${captureServerUrl()}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export function applyCaptureResult(
  prev: {
    dimensions: Record<string, { width: number; height: number }>;
    screens: Record<string, FlowMapVersionEntry>;
    flows: Record<string, FlowMapVersionEntry>;
    cacheKeys: Record<string, string>;
  },
  result: CaptureFlowResult,
) {
  const next = {
    dimensions: { ...prev.dimensions },
    screens: { ...prev.screens },
    flows: { ...prev.flows },
    cacheKeys: { ...prev.cacheKeys },
  };

  if (result.bumps) {
    for (const bump of result.bumps.screens) {
      next.screens[bump.id] = { version: bump.nextVersion, updatedAt: bump.updatedAt };
      next.cacheKeys[bump.id] = bump.nextVersion;
    }
    for (const bump of result.bumps.flows) {
      next.flows[bump.id] = { version: bump.nextVersion, updatedAt: bump.updatedAt };
    }
  }

  for (const screen of result.screens) {
    if (!screen.changed) continue;
    next.dimensions[screen.id] = { width: screen.width, height: screen.height };
    if (!result.bumps) {
      next.screens[screen.id] = { version: screen.version, updatedAt: screen.updatedAt };
      next.cacheKeys[screen.id] = screen.version;
    }
  }

  if (!result.bumps) {
    for (const flow of result.flows) {
      if (!flow.changed) continue;
      next.flows[flow.id] = { version: flow.version, updatedAt: flow.updatedAt };
    }
  }

  return next;
}
