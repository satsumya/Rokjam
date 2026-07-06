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

export function mixHex(base: string, target: string, targetWeight: number) {
  const [br, bg, bb] = parseHex(base);
  const [tr, tg, tb] = parseHex(target);
  const weight = Math.min(1, Math.max(0, targetWeight));
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

export function pickReadableText(background: string, options: string[]) {
  const ranked = options
    .map((color) => ({ color, ratio: contrastRatio(color, background) }))
    .sort((a, b) => b.ratio - a.ratio);
  return ranked[0]?.color ?? options[0];
}

export function buildScale(main: string, lightTarget = '#FFFFFF', darkTarget = '#000000') {
  return {
    50: mixHex(main, lightTarget, 0.92),
    100: mixHex(main, lightTarget, 0.84),
    200: mixHex(main, lightTarget, 0.68),
    300: mixHex(main, lightTarget, 0.52),
    400: mixHex(main, lightTarget, 0.28),
    500: main,
    600: mixHex(main, darkTarget, 0.12),
    700: mixHex(main, darkTarget, 0.28),
    800: mixHex(main, darkTarget, 0.44),
    900: mixHex(main, darkTarget, 0.6),
  } as const;
}

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type ColorScale = Record<ColorShade, string>;

export type PaletteShades = {
  main: string;
  light: string;
  dark: string;
  accent: string;
};

export function buildPalette(main: string, lightTarget = '#FFFFFF', darkTarget = '#000000'): PaletteShades {
  const scale = buildScale(main, lightTarget, darkTarget);
  return {
    main,
    light: scale[100],
    dark: scale[800],
    accent: scale[600],
  };
}

export function buildContrastPair(background: string, tonal: string, neutralLight: string, neutralDark: string) {
  return {
    tonal: pickReadableText(background, [tonal, neutralDark, neutralLight]),
    neutral: pickReadableText(background, [neutralDark, neutralLight, tonal]),
  };
}
