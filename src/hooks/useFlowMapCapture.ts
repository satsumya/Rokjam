import { useCallback, useEffect, useState } from 'react';

import type { FlowMapVersionEntry } from '../constants/flowMapManifest';
import { FLOW_MAP_MANIFEST } from '../constants/flowMapManifest';
import {
  applyCaptureResult,
  captureFlowMapAll,
  captureFlowMapFlow,
  captureFlowMapScreens,
  checkFlowMapCaptureServer,
  fetchFlowMapManifest,
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
  const [info, setInfo] = useState<string | null>(null);
  const [state, setState] = useState<CaptureState>(initialState);

  useEffect(() => {
    void checkFlowMapCaptureServer().then(setServerReady);
  }, []);

  useEffect(() => {
    if (!serverReady) return;
    void fetchFlowMapManifest()
      .then((manifest) => {
        setState((prev) => ({
          ...prev,
          screens: { ...manifest.screens },
          flows: { ...manifest.flows },
        }));
      })
      .catch(() => {
        // Capture server unavailable — keep bundled manifest.
      });
  }, [serverReady]);

  const handleResult = useCallback((result: Awaited<ReturnType<typeof captureFlowMapScreens>>) => {
    const screenBumps = result.bumps?.screens ?? [];
    const changedCount =
      screenBumps.length ||
      result.changedScreenIds?.length ||
      result.screens.filter((s) => s.changed).length;

    if (changedCount === 0) {
      setInfo('No visual changes detected — versions unchanged.');
    } else if (screenBumps.length === 1) {
      setInfo(`Updated ${screenBumps[0].id} → v${screenBumps[0].nextVersion}.`);
    } else {
      setInfo(`Updated ${changedCount} screen${changedCount === 1 ? '' : 's'} (patch version bump).`);
    }

    setState((prev) => applyCaptureResult(prev, result));
  }, []);

  const updateScreen = useCallback(
    async (screenId: string) => {
      setBusyKey(`screen:${screenId}`);
      setError(null);
      setInfo(null);
      try {
        const result = await captureFlowMapScreens([screenId]);
        handleResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBusyKey(null);
      }
    },
    [handleResult],
  );

  const updateFlow = useCallback(
    async (flowId: string) => {
      setBusyKey(`flow:${flowId}`);
      setError(null);
      setInfo(null);
      try {
        const result = await captureFlowMapFlow(flowId);
        handleResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBusyKey(null);
      }
    },
    [handleResult],
  );

  const updateAll = useCallback(async () => {
    setBusyKey('all');
    setError(null);
    setInfo(null);
    try {
      const result = await captureFlowMapAll();
      handleResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyKey(null);
    }
  }, [handleResult]);

  return {
    serverReady,
    busyKey,
    error,
    info,
    dimensions: state.dimensions,
    screenMeta: state.screens,
    flowMeta: state.flows,
    cacheKeys: state.cacheKeys,
    updateScreen,
    updateFlow,
    updateAll,
  };
}
