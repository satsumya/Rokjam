/**
 * Spacing scale — see docs/tickets/DesignSystem.md (when documented).
 *
 * Base steps (px): 4 · 6 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80
 * Mostly a 4px grid, with 6 as a half-step for tight vertical padding (e.g. buttons).
 * Prefer these tokens over raw numbers in layout and component styles.
 */
export const SPACING_SCALE = [4, 6, 8, 12, 16, 24, 32, 48, 64, 80] as const;

export type Space = (typeof SPACING_SCALE)[number];

/** Lookup by step size — `space[16]` → 16. */
export const space = {
  4: 4,
  6: 6,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
  64: 64,
  80: 80,
} as const satisfies Record<Space, number>;
