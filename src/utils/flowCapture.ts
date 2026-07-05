export const FLOW_CAPTURE_PARAM = 'flowCapture';
export const FLOW_CAPTURE_VALUE = '1';

export function isFlowCaptureActive(params: { flowCapture?: string | string[] }) {
  const value = params.flowCapture;
  if (Array.isArray(value)) return value.includes(FLOW_CAPTURE_VALUE);
  return value === FLOW_CAPTURE_VALUE;
}

/** Append to routes when capturing flow-map PNGs (hides PrototypeOnly UI). */
export function appendFlowCaptureQuery(path: string) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${FLOW_CAPTURE_PARAM}=${FLOW_CAPTURE_VALUE}`;
}
