import { useCallback, useEffect, useState } from 'react';

import type { FlowMapVersionEntry } from '../constants/flowMapManifest';
import { FLOW_MAP_MANIFEST } from '../constants/flowMapManifest';
import {
  applyCaptureResult,
  captureFlowMapFlow,
  captureFlowMapScreens,
  checkFlowMapCaptureServer,
} from '../utils/flowScreenCaptureClient';

type CaptureState = {
  dimensions: Record<string, { width: number; height: number }>;
  screens: Record<string, FlowMapVersionEntry>;
  flows: Record<string, FlowMapVersionEntry>;
  cacheKeys: Record<string, string>;
};

const initialState: CaptureState = {
  dimensions: {},
  screens: { ...FLOW_MAP_MANIFEST.screens },
  flows: { ...FLOW_MAP_MANIFEST.flows },
  cacheKeys: {},
};

export function useFlowMapCapture() {
  const [serverReady, setServerReady] = useState<boolean | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<CaptureState>(initialState);

  useEffect(() => {
    void checkFlowMapCaptureServer().then(setServerReady);
  }, []);

  const updateScreen = useCallback(async (screenId: string) => {
    setBusyKey(`screen:${screenId}`);
    setError(null);
    try {
      const result = await captureFlowMapScreens([screenId]);
      setState((prev) => applyCaptureResult(prev, result));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyKey(null);
    }
  }, []);

  const updateFlow = useCallback(async (flowId: string) => {
    setBusyKey(`flow:${flowId}`);
    setError(null);
    try {
      const result = await captureFlowMapFlow(flowId);
      setState((prev) => applyCaptureResult(prev, result));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyKey(null);
    }
  }, []);

  return {
    serverReady,
    busyKey,
    error,
    dimensions: state.dimensions,
    screenMeta: state.screens,
    flowMeta: state.flows,
    cacheKeys: state.cacheKeys,
    updateScreen,
    updateFlow,
  };
}
