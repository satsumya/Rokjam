import raw from './flowMapManifest.json';

export type FlowMapVersionEntry = {
  version: string;
  updatedAt: string;
};

export type FlowMapManifest = {
  flows: Record<string, FlowMapVersionEntry>;
  screens: Record<string, FlowMapVersionEntry>;
};

export const FLOW_MAP_MANIFEST = raw as FlowMapManifest;

export function getFlowManifest(flowId: string): FlowMapVersionEntry | undefined {
  return FLOW_MAP_MANIFEST.flows[flowId];
}

export function getScreenManifest(screenId: string): FlowMapVersionEntry | undefined {
  return FLOW_MAP_MANIFEST.screens[screenId];
}
