/**
 * Icon size tokens (px) — the shared scale for all iconography. Pass the token
 * name to the Icon atom's `size` prop (e.g. `<Icon name="house" size="sm" />`)
 * instead of a raw number so icon sizing stays on a consistent scale.
 */
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export type IconSize = keyof typeof iconSizes;

export const ICON_SIZE_NAMES = Object.keys(iconSizes) as IconSize[];
