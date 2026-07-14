/**
 * Build a W3C Design Tokens (DTCG) JSON document from the live colour tokens.
 * Import into Figma via a variables plugin that accepts DTCG JSON
 * (e.g. Variables JSON Import, Tokens Brücke, tokenHaus).
 *
 * Token paths mirror DesignSystem.md / the colour system page
 * (brand.green.main, brand.green.main.contrast.alt, neutral.500, ui.text, …).
 */
import {
  BRAND_COLOR_ORDER,
  NEUTRAL_SHADES,
  SEMANTIC_COLOR_ORDER,
  colors,
  ui,
  type BrandColorId,
  type SemanticColorId,
  type UiColorToken,
} from './colors';
import { parseHex } from './colorUtils';
import { BUTTON_COLOR_STYLE_ORDER, buttonStyleTokens } from './buttonStyles';

export type DtcgColorToken = {
  $type: 'color';
  $value: string;
};

type DtcgNode = DtcgColorToken | { [key: string]: DtcgNode | string | undefined };

function colorToken(value: string): DtcgColorToken {
  return { $type: 'color', $value: toFigmaColorValue(value) };
}

/** Prefer #RRGGBB / #RRGGBBAA — more reliable than rgba() for Figma importers. */
function toFigmaColorValue(value: string): string {
  const rgba = value.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)$/i,
  );
  if (rgba) {
    const [, rs, gs, bs, as] = rgba;
    const hex = [rs, gs, bs]
      .map((channel) => Number(channel).toString(16).padStart(2, '0'))
      .join('');
    if (as === undefined || as === '') return `#${hex}`;
    const alpha = Math.round(Math.min(1, Math.max(0, Number(as))) * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hex}${alpha}`;
  }

  try {
    const [r, g, b] = parseHex(value);
    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  } catch {
    return value;
  }
}

function brandGroup(id: BrandColorId): DtcgNode {
  const token = colors.brand[id];
  return {
    main: {
      ...colorToken(token.main),
      contrast: {
        alt: colorToken(token.mainContrast.alt),
        tonal: colorToken(token.mainContrast.tonal),
      },
    },
    light: {
      ...colorToken(token.light),
      contrast: colorToken(token.lightContrast),
    },
    dark: {
      ...colorToken(token.dark),
      contrast: colorToken(token.darkContrast),
    },
    accent: colorToken(token.accent),
  };
}

function semanticGroup(id: SemanticColorId): DtcgNode {
  const token = colors.semantic[id];
  return {
    main: {
      ...colorToken(token.main),
      contrast: colorToken(token.mainContrast),
    },
    accent: {
      ...colorToken(token.accent),
      contrast: colorToken(token.accentContrast),
    },
  };
}

function neutralGroup(): DtcgNode {
  return Object.fromEntries(
    NEUTRAL_SHADES.map((shade) => [String(shade), colorToken(colors.neutral[shade])]),
  );
}

function uiGroup(): DtcgNode {
  return Object.fromEntries(
    (Object.keys(ui) as UiColorToken[]).map((key) => [key, colorToken(ui[key])]),
  );
}

function buttonStylesGroup(): DtcgNode {
  return Object.fromEntries(
    BUTTON_COLOR_STYLE_ORDER.map((id) => {
      const tokens = buttonStyleTokens(id);
      return [
        id,
        {
          fill: colorToken(tokens.fill),
          stroke: colorToken(tokens.stroke),
          shadow: colorToken(tokens.shadow),
          text: colorToken(tokens.text),
        },
      ];
    }),
  );
}

/** Nested DTCG document ready to stringify / download. */
export function buildFigmaColorTokensDocument(): DtcgNode {
  return {
    $description:
      'Rokjam colour tokens (DTCG). Import with a Figma variables plugin that accepts Design Tokens JSON.',
    brand: Object.fromEntries(BRAND_COLOR_ORDER.map((id) => [id, brandGroup(id)])),
    neutral: neutralGroup(),
    semantic: Object.fromEntries(SEMANTIC_COLOR_ORDER.map((id) => [id, semanticGroup(id)])),
    ui: uiGroup(),
    button: {
      $description: 'Button colour styles — fill, 2px stroke, y4 shadow, and text per style.',
      ...buttonStylesGroup(),
    },
  };
}

export const FIGMA_COLOR_TOKENS_FILENAME = 'rokjam-color-tokens.figma.json';

export function stringifyFigmaColorTokens(space = 2): string {
  return `${JSON.stringify(buildFigmaColorTokensDocument(), null, space)}\n`;
}
