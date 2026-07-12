/**
 * Design system colour tokens — see docs/tickets/DesignSystem.md.
 * Visual reference: /color-system
 */
import { buildScale, mixHex, resolveTonalContrast, type ColorScale, type TonalContrastConfig } from './colorUtils';

export type BrandColorId =
  | 'yellow'
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'red'
  | 'black'
  | 'white'
  | 'pink';

export type SemanticColorId = 'negative' | 'attention' | 'positive' | 'info' | 'discovery';

export type BrandPaletteDefinition = {
  main: string;
  light: string;
  dark: string;
  accent: string;
  mainContrast: {
    alt: string;
    tonal: TonalContrastConfig;
  };
};

export type BrandColorToken = {
  main: string;
  light: string;
  dark: string;
  accent: string;
  mainContrast: { alt: string; tonal: string };
  lightContrast: string;
  darkContrast: string;
};

export type SemanticPaletteDefinition = {
  /** Manually chosen accent hex (used for borders, icons, and accent fills). */
  accent: string;
  /** Manually chosen contrast (text/icon) for use on the accent. */
  accentContrast: string;
  /** Manually chosen contrast (text) for use on main. */
  mainContrast: string;
  /** How much the accent mixes into neutral[900] to produce main (0–1). Defaults to SEMANTIC_MAIN_MIX. */
  mainMix?: number;
};

export type SemanticColorToken = {
  /** neutral[800] tinted with the accent. */
  main: string;
  mainContrast: string;
  accent: string;
  accentContrast: string;
};

const BRAND_PALETTES: Record<BrandColorId, BrandPaletteDefinition> = {
  yellow: {
    main: '#FFD95C',
    light: '#FEEFB3',
    dark: '#563809',
    accent: '#FCD32C',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.35 } },
  },
  blue: {
    main: '#60ABEC',
    light: '#DFEEFB',
    dark: '#1F4BC4',
    accent: '#60ABEC',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.45 } },
  },
  purple: {
    main: '#B69FFF',
    light: '#E2DCFF',
    dark: '#5F47A9',
    accent: '#9A7FE8',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.3 } },
  },
  green: {
    main: '#6BBB86',
    light: '#E0F0E8',
    dark: '#025A3A',
    accent: '#52A872',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.2 } },
  },
  orange: {
    main: '#FF9E49',
    light: '#FFDCBE',
    dark: '#B35900',
    accent: '#E8842E',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.25 } },
  },
  red: {
    main: '#D34040',
    light: '#F5D2D2',
    dark: '#980A0A',
    accent: '#D34040',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.2 } },
  },
  black: {
    main: '#2A2A2A',
    light: '#D3D2D2',
    dark: '#2A2A2A',
    accent: '#000000',
    mainContrast: { alt: '#FAFBFB', tonal: { from: 'light', lightTarget: '#FFFFFF', mix: 0.4 } },
  },
  white: {
    main: '#FAFBFB',
    light: '#FAFBFB',
    dark: '#676D70',
    accent: '#B8BFC2',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.5 } },
  },
  pink: {
    main: '#FF78A2',
    light: '#FFD2E1',
    dark: '#C82468',
    accent: '#FF78A2',
    mainContrast: { alt: '#1F1A14', tonal: { from: 'dark', darkTarget: '#1F1A14', mix: 0.25 } },
  },
};

const NEUTRAL_SEED = '#E5D2C0';
const neutralScale: ColorScale = buildScale(NEUTRAL_SEED, '#FFFCF8', '#1F1A14');

function buildBrandToken(definition: BrandPaletteDefinition): BrandColorToken {
  const { main, light, dark, accent, mainContrast } = definition;
  return {
    main,
    light,
    dark,
    accent,
    mainContrast: {
      alt: mainContrast.alt,
      tonal: resolveTonalContrast({ light, dark }, mainContrast.tonal),
    },
    lightContrast: dark,
    darkContrast: light,
  };
}

/** Default mix of accent into neutral[900] for semantic `main`. */
export const SEMANTIC_MAIN_MIX = 0.12;

const SEMANTIC_PALETTES: Record<SemanticColorId, SemanticPaletteDefinition> = {
  negative: { accent: '#AD2424', accentContrast: '#FFFFFF', mainContrast: '#FF7272', mainMix: 0.24 },
  attention: { accent: '#FBC66F', accentContrast: '#332c25', mainContrast: '#FBC66F' },
  positive: { accent: '#92E98A', accentContrast: '#332c25', mainContrast: '#92E98A' },
  info: { accent: '#0375AA', accentContrast: '#FFFFFF', mainContrast: '#95CEE9', mainMix: 0.24 },
  discovery: { accent: '#D29EF8', accentContrast: '#332c25', mainContrast: '#D29EF8' },
};

function buildSemanticToken(definition: SemanticPaletteDefinition): SemanticColorToken {
  const { accent, accentContrast, mainContrast, mainMix } = definition;
  return {
    main: mixHex(neutralScale[900], accent, mainMix ?? SEMANTIC_MAIN_MIX),
    mainContrast,
    accent,
    accentContrast,
  };
}

export const colors = {
  brand: {
    yellow: buildBrandToken(BRAND_PALETTES.yellow),
    blue: buildBrandToken(BRAND_PALETTES.blue),
    purple: buildBrandToken(BRAND_PALETTES.purple),
    green: buildBrandToken(BRAND_PALETTES.green),
    orange: buildBrandToken(BRAND_PALETTES.orange),
    red: buildBrandToken(BRAND_PALETTES.red),
    black: buildBrandToken(BRAND_PALETTES.black),
    white: buildBrandToken(BRAND_PALETTES.white),
    pink: buildBrandToken(BRAND_PALETTES.pink),
  },
  neutral: neutralScale,
  semantic: {
    negative: buildSemanticToken(SEMANTIC_PALETTES.negative),
    attention: buildSemanticToken(SEMANTIC_PALETTES.attention),
    positive: buildSemanticToken(SEMANTIC_PALETTES.positive),
    info: buildSemanticToken(SEMANTIC_PALETTES.info),
    discovery: buildSemanticToken(SEMANTIC_PALETTES.discovery),
  },
} as const;

export const BRAND_COLOR_ORDER: BrandColorId[] = [
  'yellow',
  'blue',
  'purple',
  'green',
  'orange',
  'red',
  'black',
  'white',
  'pink',
];

export const SEMANTIC_COLOR_ORDER: SemanticColorId[] = [
  'negative',
  'attention',
  'positive',
  'info',
  'discovery',
];

export const NEUTRAL_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export function brandColorLabel(id: BrandColorId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export function semanticColorLabel(id: SemanticColorId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
