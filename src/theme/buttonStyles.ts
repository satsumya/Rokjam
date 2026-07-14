/**
 * Button colour styles — two general brand presets + one per difficulty colour.
 * Every colour references theme tokens in `colors.ts` / `ui`; geometry (stroke,
 * shadow offset, radius, padding) is shared so styles stay consistent.
 *
 * Visual: filled face, 2px stroke, solid shadow band offset on Y (no blur).
 */
import {
  BRAND_COLOR_ORDER,
  brandColorLabel,
  colors,
  ui,
  type BrandColorId,
} from './colors';
import { space } from './spacing';

/** Shared geometry & padding for all button variants (primary / secondary / ghost). */
export const buttonGeometry = {
  strokeWidth: 2,
  shadowOffsetY: space[4],
  borderRadius: 10,
  /** Single source for padding — change here to update every button variant. */
  padding: {
    large: {
      paddingVertical: space[6],
      paddingHorizontal: space[16],
    },
    small: {
      paddingVertical: space[4],
      paddingHorizontal: space[16],
    },
  },
} as const;

export type ButtonColorStyle = 'style1' | 'style2' | BrandColorId;

export type ButtonStyleTokens = {
  /** Face fill. */
  fill: string;
  /** 2px stroke. */
  stroke: string;
  /** Solid y-offset shadow band (no blur). */
  shadow: string;
  /** Label colour. */
  text: string;
};

const BRAND_STYLES: Record<'style1' | 'style2', ButtonStyleTokens> = {
  // Pastel multi-brand combo matching the Style 1 primary examples.
  style1: {
    fill: colors.brand.blue.light,
    stroke: colors.brand.green.main,
    shadow: colors.brand.purple.main,
    text: ui.text,
  },
  // Pastel multi-brand combo matching the Style 2 primary examples.
  style2: {
    fill: colors.brand.pink.light,
    stroke: colors.brand.orange.main,
    shadow: colors.brand.yellow.main,
    text: ui.text,
  },
};

function difficultyStyle(id: BrandColorId): ButtonStyleTokens {
  const palette = colors.brand[id];
  const inverse = id === 'red' || id === 'black';
  const onMain = inverse ? palette.mainContrast.alt : palette.dark;
  // Shadow uses accent for depth; fall back to dark when accent matches main (pink)
  // or when a deeper band reads better (red).
  const shadow =
    id === 'pink' || id === 'red' ? palette.dark : palette.accent;

  return {
    fill: palette.main,
    stroke: palette.accent,
    shadow: palette.accent,
    text: onMain,
  };
}

/** Resolve fill / stroke / shadow / text for a button colour style. */
export function buttonStyleTokens(style: ButtonColorStyle): ButtonStyleTokens {
  if (style === 'style1' || style === 'style2') {
    return BRAND_STYLES[style];
  }
  return difficultyStyle(style);
}

export const BUTTON_COLOR_STYLE_ORDER: ButtonColorStyle[] = [
  'style1',
  'style2',
  ...BRAND_COLOR_ORDER,
];

export function buttonColorStyleLabel(style: ButtonColorStyle): string {
  if (style === 'style1') return 'Style 1';
  if (style === 'style2') return 'Style 2';
  return `${brandColorLabel(style)} difficulty`;
}
