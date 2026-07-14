export function parseHex(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '').trim();
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const value = Number.parseInt(expanded, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function formatHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, '0'))
    .join('')}`;
}

export function mixHex(base: string, target: string, mix: number) {
  const [br, bg, bb] = parseHex(base);
  const [tr, tg, tb] = parseHex(target);
  const weight = Math.min(1, Math.max(0, mix));
  return formatHex(
    br * (1 - weight) + tr * weight,
    bg * (1 - weight) + tg * weight,
    bb * (1 - weight) + tb * weight,
  );
}

export function withAlpha(hex: string, alpha: number) {
  const [r, g, b] = parseHex(hex);
  const clamped = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clamped})`;
}

export function relativeLuminance(hex: string) {
  const channels = parseHex(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG 2.x AA minimum contrast ratios. */
export const WCAG_AA_NORMAL_TEXT = 4.5;
export const WCAG_AA_LARGE_TEXT = 3;

export function wcagAaStatus(foreground: string, background: string) {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    passesNormalText: ratio >= WCAG_AA_NORMAL_TEXT,
    passesLargeText: ratio >= WCAG_AA_LARGE_TEXT,
  };
}

export function formatContrastRatio(ratio: number) {
  return `${ratio.toFixed(2)}:1`;
}

export function pickReadableText(background: string, options: string[]) {
  const ranked = options
    .map((color) => ({ color, ratio: contrastRatio(color, background) }))
    .sort((a, b) => b.ratio - a.ratio);
  return ranked[0]?.color ?? options[0];
}

export function buildScale(main: string, lightTarget = '#FFFFFF', darkTarget = '#000000') {
  return {
    50: mixHex(main, lightTarget, 0.88),
    100: mixHex(main, lightTarget, 0.64),
    200: mixHex(main, lightTarget, 0.46),
    300: main,
    400: mixHex(main, darkTarget, 0.1),
    500: mixHex(main, darkTarget, 0.48),
    600: mixHex(main, darkTarget, 0.72),
    700: mixHex(main, darkTarget, 0.86),
    800: mixHex(main, darkTarget, 0.95),
    900: mixHex(main, darkTarget, 1),
  } as const;
}

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type ColorScale = Record<ColorShade, string>;

export type TonalContrastConfig = {
  /** Start from this palette shade. */
  from: 'dark' | 'light';
  /** Mix toward this colour to improve contrast on main (0–1). */
  mix?: number;
  /** Used when `from` is `dark`. Defaults to `#000000`. */
  darkTarget?: string;
  /** Used when `from` is `light`. Defaults to `#FFFFFF`. */
  lightTarget?: string;
};

export function resolveTonalContrast(
  shades: { light: string; dark: string },
  config: TonalContrastConfig,
): string {
  const base = config.from === 'dark' ? shades.dark : shades.light;
  const mix = config.mix ?? 0;
  if (mix <= 0) return base;

  const target =
    config.from === 'dark'
      ? (config.darkTarget ?? '#000000')
      : (config.lightTarget ?? '#FFFFFF');

  return mixHex(base, target, mix);
}
