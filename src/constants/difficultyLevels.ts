import { colors, BRAND_COLOR_ORDER, brandColorLabel, type BrandColorId } from '../theme/colors';

/** Single brand colour as a named level preset (name + main hex). */
export function levelPreset(id: BrandColorId) {
  return {
    id,
    name: brandColorLabel(id),
    color: colors.brand[id].main,
  } as const;
}

/**
 * Level colour presets — always derived from {@link BRAND_COLOR_ORDER}
 * (rainbow order, achromatics last). Do not hardcode a parallel order elsewhere.
 */
export const DEFAULT_LEVEL_COLORS = BRAND_COLOR_ORDER.map((id) => levelPreset(id));

export const PET_ROCK_AVATARS = ['🪨', '🗿', '⛰️', '🧱', '💎'] as const;
