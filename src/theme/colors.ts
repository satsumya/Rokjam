/**
 * Design system colour tokens — see docs/tickets/DesignSystem.md.
 * Visual reference: /color-system
 */
import {
  buildContrastPair,
  buildPalette,
  buildScale,
  type ColorScale,
  type PaletteShades,
} from './colorUtils';

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

export type BrandColorToken = PaletteShades & {
  scale: ColorScale;
  contrast: { neutral: string; tonal: string };
};

export type SemanticColorToken = BrandColorToken;

const BRAND_MAIN: Record<BrandColorId, string> = {
  yellow: '#FCD32C',
  blue: '#60ABEC',
  purple: '#B69FFF',
  green: '#6BBB86',
  orange: '#FF9E49',
  red: '#D34040',
  black: '#2C3E50',
  white: '#ECF0F1',
  pink: '#FF69B4',
};

const NEUTRAL_SEED = '#E8DFD2';

const neutralScale = buildScale(NEUTRAL_SEED, '#FFFCF8', '#1F1A14');

function createBrandToken(id: BrandColorId): BrandColorToken {
  const main = BRAND_MAIN[id];
  const lightTarget = id === 'white' ? '#FFFFFF' : '#FFFFFF';
  const darkTarget = id === 'black' ? '#000000' : '#1F1A14';
  const scale = buildScale(main, lightTarget, darkTarget);
  const palette = buildPalette(main, lightTarget, darkTarget);

  return {
    ...palette,
    scale,
    contrast: buildContrastPair(main, palette.dark, neutralScale[50], neutralScale[900]),
  };
}

function createSemanticToken(main: string): SemanticColorToken {
  const scale = buildScale(main);
  const palette = buildPalette(main);

  return {
    ...palette,
    scale,
    contrast: buildContrastPair(main, palette.dark, neutralScale[50], neutralScale[900]),
  };
}

export const colors = {
  brand: {
    yellow: createBrandToken('yellow'),
    blue: createBrandToken('blue'),
    purple: createBrandToken('purple'),
    green: createBrandToken('green'),
    orange: createBrandToken('orange'),
    red: createBrandToken('red'),
    black: createBrandToken('black'),
    white: createBrandToken('white'),
    pink: createBrandToken('pink'),
  },
  neutral: neutralScale,
  semantic: {
    negative: createSemanticToken(BRAND_MAIN.red),
    attention: createSemanticToken(BRAND_MAIN.orange),
    positive: createSemanticToken(BRAND_MAIN.green),
    info: createSemanticToken(BRAND_MAIN.blue),
    discovery: createSemanticToken(BRAND_MAIN.purple),
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
