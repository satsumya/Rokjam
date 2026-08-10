export type AppMode = 'prototype' | 'production';

/** Routes available only when `EXPO_PUBLIC_APP_MODE=prototype`. */
export const PROTOTYPE_ONLY_ROUTES = [
  '/scenarios',
  '/flow-map',
  '/color-system',
  '/typography',
  '/icon-library',
] as const;

export type PrototypeOnlyRoute = (typeof PROTOTYPE_ONLY_ROUTES)[number];

/**
 * `prototype` (default) — product routes + QA/design tooling.
 * `production` — product routes only (store builds).
 */
export function getAppMode(): AppMode {
  const raw = process.env.EXPO_PUBLIC_APP_MODE;
  if (raw === 'production') return 'production';
  return 'prototype';
}

export function isPrototypeMode(): boolean {
  return getAppMode() === 'prototype';
}

export function isProductionMode(): boolean {
  return getAppMode() === 'production';
}
