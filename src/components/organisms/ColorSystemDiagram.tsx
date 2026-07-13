import { ScrollView, Text, View } from 'react-native';

import {
  BRAND_COLOR_ORDER,
  NEUTRAL_SHADES,
  SEMANTIC_COLOR_ORDER,
  brandColorLabel,
  colors,
  semanticColorLabel,
  type BrandColorId,
  type SemanticColorId,
} from '../../theme/colors';
import { withAlpha } from '../../theme/colorUtils';
import { Section } from '../atoms/Section';
import { ShadeSwatch, Swatch, WcagAaCheck } from '../atoms/ColorSwatch';
import { PaletteRow } from '../molecules/PaletteRow';

export type ColorSystemFilter = 'all' | 'brand' | 'neutral' | 'semantic';

const ALPHA_STEPS = [1, 0.75, 0.5, 0.25, 0.12] as const;

function brandPaletteSwatches(prefix: string, token: (typeof colors.brand)[BrandColorId]) {
  return (
    <>
      <ShadeSwatch
        token={`${prefix}.main`}
        background={token.main}
        contrasts={[
          {
            label: 'contrast.alt',
            token: `${prefix}.main.contrast.alt`,
            color: token.mainContrast.alt,
          },
          {
            label: 'contrast.tonal',
            token: `${prefix}.main.contrast.tonal`,
            color: token.mainContrast.tonal,
          },
        ]}
      />
      <ShadeSwatch
        token={`${prefix}.light`}
        background={token.light}
        contrasts={[
          {
            label: 'contrast',
            token: `${prefix}.light.contrast`,
            color: token.lightContrast,
          },
        ]}
      />
      <ShadeSwatch
        token={`${prefix}.dark`}
        background={token.dark}
        contrasts={[
          {
            label: 'contrast',
            token: `${prefix}.dark.contrast`,
            color: token.darkContrast,
          },
        ]}
      />
      <ShadeSwatch token={`${prefix}.accent`} background={token.accent} accentBorder={token.accent} />
    </>
  );
}

function BrandPaletteSection({ id }: { id: BrandColorId }) {
  const token = colors.brand[id];
  const label = brandColorLabel(id);

  return (
    <PaletteRow
      title={`Brand ${label}`}
      description="Text on each shade uses its contrast tokens — main shows both alt and tonal options."
    >
      {brandPaletteSwatches(`brand.${id}`, token)}
    </PaletteRow>
  );
}

function SemanticPaletteSection({ id }: { id: SemanticColorId }) {
  const token = colors.semantic[id];
  const label = semanticColorLabel(id);
  const prefix = `semantic.${id}`;

  return (
    <PaletteRow
      title={`Semantic ${label}`}
      description="Main is neutral 800 tinted with the accent. Accent, accent contrast, and main contrast are set manually."
    >
      <ShadeSwatch
        token={`${prefix}.main`}
        background={token.main}
        contrasts={[
          {
            label: 'main.contrast',
            token: `${prefix}.main.contrast`,
            color: token.mainContrast,
          },
        ]}
      />
      <ShadeSwatch
        token={`${prefix}.accent`}
        background={token.accent}
        contrasts={[
          {
            label: 'accent.contrast',
            token: `${prefix}.accent.contrast`,
            color: token.accentContrast,
          },
        ]}
      />
    </PaletteRow>
  );
}

function AlphaPreview({ title, baseToken, baseColor }: { title: string; baseToken: string; baseColor: string }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.neutral[900] }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {ALPHA_STEPS.map((alpha) => (
          <View key={alpha} style={{ width: 120, gap: 6 }}>
            <View
              style={{
                height: 64,
                borderRadius: 10,
                backgroundColor: withAlpha(baseColor, alpha),
                borderWidth: 1,
                borderColor: colors.neutral[200],
              }}
            />
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.neutral[800] }}>
              {baseToken} @ {Math.round(alpha * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ColorSystemDiagram({ filter = 'all' }: { filter?: ColorSystemFilter }) {
  const showBrand = filter === 'all' || filter === 'brand';
  const showNeutral = filter === 'all' || filter === 'neutral';
  const showSemantic = filter === 'all' || filter === 'semantic';

  return (
    <>
      {showBrand ? (
        <Section title="Brand colours">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 8 }}>
            Used for climbing difficulty levels and brand accents. Contrast colours are for text on their
            related shade — e.g. text on `brand.yellow.main` uses `main.contrast.alt` or `main.contrast.tonal`.
            Each contrast shows WCAG AA pass/fail (normal text 4.5:1, large text 3:1).
          </Text>
          <View style={{ gap: 20 }}>
            {BRAND_COLOR_ORDER.map((id) => (
              <BrandPaletteSection key={id} id={id} />
            ))}
          </View>
        </Section>
      ) : null}

      {showNeutral ? (
        <Section title="Neutral (sandy)">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 8 }}>
            50–100 for backgrounds; 800–900 for text.
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
            <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 4 }}>
              {NEUTRAL_SHADES.map((shade) => (
                <Swatch key={shade} token={`neutral.${shade}`} value={colors.neutral[shade]} />
              ))}
            </View>
          </ScrollView>
        </Section>
      ) : null}

      {showSemantic ? (
        <Section title="Semantic colours">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 8 }}>
            Negative, attention, positive, info, and discovery states.
          </Text>
          <View style={{ gap: 20 }}>
            {SEMANTIC_COLOR_ORDER.map((id) => (
              <SemanticPaletteSection key={id} id={id} />
            ))}
          </View>
        </Section>
      ) : null}

      {filter === 'all' ? (
        <Section title="Alpha previews">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 12 }}>
            Main shades with alpha blending — useful for overlays and subtle fills.
          </Text>
          <View style={{ gap: 20 }}>
            <AlphaPreview title="Brand blue" baseToken="brand.blue.main" baseColor={colors.brand.blue.main} />
            <AlphaPreview
              title="Semantic negative"
              baseToken="semantic.negative.main"
              baseColor={colors.semantic.negative.main}
            />
            <AlphaPreview title="Neutral 500" baseToken="neutral.500" baseColor={colors.neutral[500]} />
          </View>
        </Section>
      ) : null}

      {filter === 'all' ? (
        <Section title="Climbing difficulty chips">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 12 }}>
            How brand colours appear on level labels in the app.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {BRAND_COLOR_ORDER.map((id) => {
              const token = colors.brand[id];
              const text = token.mainContrast.tonal;
              return (
                <View key={id} style={{ gap: 4, maxWidth: 160 }}>
                  <View
                    style={{
                      borderRadius: 999,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      backgroundColor: token.main,
                      borderWidth: 1,
                      borderColor: colors.neutral[300],
                    }}
                  >
                    <Text style={{ fontWeight: '700', color: text }}>{brandColorLabel(id)}</Text>
                  </View>
                  <WcagAaCheck foreground={text} background={token.main} />
                </View>
              );
            })}
          </View>
        </Section>
      ) : null}
    </>
  );
}
