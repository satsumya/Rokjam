import { useLocalSearchParams } from 'expo-router';

import { isFlowCaptureActive } from '../utils/flowCapture';

export function useFlowCapture() {
  const params = useLocalSearchParams<{ flowCapture?: string | string[] }>();
  return isFlowCaptureActive(params);
}
