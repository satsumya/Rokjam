/**
 * Typography system — see docs/tickets/DesignSystem.md § Typography.
 * Visual reference: /typography (planned)
 *
 * Built on a single modular scale following
 * https://accessibility.build/guides/accessible-typography-wcag:
 *   - Base body size: 16px (WCAG-comfortable minimum for body copy)
 *   - Ratio: 1.333 (perfect fourth) — one ratio across the whole system
 *
 * Sizes split into two groups, both drawn from the same scale:
 *   - Headings (Fira Sans): 6 sizes, h6→h1 = 16 · 21 · 28 · 38 · 51 · 67
 *   - Body (Saira): 3 sizes = 12 (small) · 16 (base) · 21 (large)
 *
 * Regular and bold weights are available for every size. Consume the composite
 * styles via the `Text` atom (`<Text variant="h2" weight="bold">`) rather than
 * reaching for raw numbers, so type stays on the scale.
 */
import type { TextStyle } from 'react-native';

export const FONT_BASE = 16;
export const FONT_RATIO = 1.333;

/** Modular scale value for a step relative to the 16px base, rounded to px. */
export const modularStep = (step: number): number =>
  Math.round(FONT_BASE * FONT_RATIO ** step);

/** Heading sizes (px) — Fira Sans. Six steps of the scale, largest first. */
export const headingSizes = {
  h1: modularStep(5), // 67
  h2: modularStep(4), // 51
  h3: modularStep(3), // 38
  h4: modularStep(2), // 28
  h5: modularStep(1), // 21
  h6: modularStep(0), // 16
} as const;

/** Body sizes (px) — Saira. One step above the base, the base, one below. */
export const bodySizes = {
  large: modularStep(1), // 21
  base: modularStep(0), //  16
  small: modularStep(-1), // 12
} as const;

/**
 * Weighted font families. React Native selects a weight by loading a distinct
 * font file, so each weight is its own family string (matching the keys passed
 * to `useFonts` in src/theme/fonts.ts). `fontWeight` is set alongside for
 * react-native-web parity.
 */
export const fontFamilies = {
  headingRegular: 'FiraSans_400Regular',
  headingBold: 'FiraSans_700Bold',
  bodyRegular: 'Saira_400Regular',
  bodyBold: 'Saira_700Bold',
} as const;

export const fontWeights = {
  regular: '400',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

export type FontWeightName = keyof typeof fontWeights;

type TypeGroup = 'heading' | 'body';

type VariantSpec = {
  group: TypeGroup;
  fontSize: number;
  /** Line-height as a multiple of the size; converted to px per variant. */
  lineHeightRatio: number;
  defaultWeight: FontWeightName;
};

/**
 * Per-role specs. Line-height follows the guide — tighter as size grows
 * (headings 1.1–1.35, body 1.5). Headings default to bold, body to regular;
 * either weight can be requested via the `weight` argument / prop.
 */
const VARIANT_SPECS = {
  h1: { group: 'heading', fontSize: headingSizes.h1, lineHeightRatio: 1.1, defaultWeight: 'bold' },
  h2: { group: 'heading', fontSize: headingSizes.h2, lineHeightRatio: 1.15, defaultWeight: 'bold' },
  h3: { group: 'heading', fontSize: headingSizes.h3, lineHeightRatio: 1.2, defaultWeight: 'bold' },
  h4: { group: 'heading', fontSize: headingSizes.h4, lineHeightRatio: 1.25, defaultWeight: 'bold' },
  h5: { group: 'heading', fontSize: headingSizes.h5, lineHeightRatio: 1.3, defaultWeight: 'bold' },
  h6: { group: 'heading', fontSize: headingSizes.h6, lineHeightRatio: 1.35, defaultWeight: 'bold' },
  bodyLarge: { group: 'body', fontSize: bodySizes.large, lineHeightRatio: 1.5, defaultWeight: 'regular' },
  body: { group: 'body', fontSize: bodySizes.base, lineHeightRatio: 1.5, defaultWeight: 'regular' },
  bodySmall: { group: 'body', fontSize: bodySizes.small, lineHeightRatio: 1.5, defaultWeight: 'regular' },
} as const satisfies Record<string, VariantSpec>;

export type TextVariant = keyof typeof VARIANT_SPECS;

export const TEXT_VARIANT_NAMES = Object.keys(VARIANT_SPECS) as TextVariant[];

const familyFor = (group: TypeGroup, weight: FontWeightName): string => {
  if (group === 'heading') {
    return weight === 'bold' ? fontFamilies.headingBold : fontFamilies.headingRegular;
  }
  return weight === 'bold' ? fontFamilies.bodyBold : fontFamilies.bodyRegular;
};

/**
 * Resolve a full text style for a variant, optionally overriding the weight.
 * Both `regular` and `bold` are available for every heading and body size.
 */
export function textStyle(variant: TextVariant, weight?: FontWeightName): TextStyle {
  const spec = VARIANT_SPECS[variant];
  const resolvedWeight = weight ?? spec.defaultWeight;
  return {
    fontFamily: familyFor(spec.group, resolvedWeight),
    fontWeight: fontWeights[resolvedWeight],
    fontSize: spec.fontSize,
    lineHeight: Math.round(spec.fontSize * spec.lineHeightRatio),
  };
}

/** Precomputed default-weight styles for each variant (for direct use in StyleSheets). */
export const textVariants = Object.fromEntries(
  TEXT_VARIANT_NAMES.map((variant) => [variant, textStyle(variant)]),
) as Record<TextVariant, TextStyle>;
