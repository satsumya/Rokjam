import { colors, BRAND_COLOR_ORDER, brandColorLabel } from '../theme/colors';

export const DEFAULT_LEVEL_COLORS = BRAND_COLOR_ORDER.map((id) => ({
  name: brandColorLabel(id),
  color: colors.brand[id].main,
}));

export const PET_ROCK_AVATARS = ['🪨', '🗿', '⛰️', '🧱', '💎'] as const;
