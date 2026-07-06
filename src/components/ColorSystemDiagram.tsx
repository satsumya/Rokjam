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
} from '../theme/colors';
import { contrastRatio, withAlpha } from '../theme/colorUtils';

import { WireframeSection } from './Wireframe';

export type ColorSystemFilter = 'all' | 'brand' | 'neutral' | 'semantic';

const ALPHA_STEPS = [1, 0.75, 0.5, 0.25, 0.12] as const;

function Swatch({
  token,
  value,
  background = '#FFFFFF',
  showContrast = true,
}: {
  token: string;
  value: string;
  background?: string;
  showContrast?: boolean;
}) {
  const onDark = colors.neutral[900];
  const onLight = colors.neutral[50];
  const textColor = contrastRatio(onDark, value) >= contrastRatio(onLight, value) ? onDark : onLight;

  return (
    <View style={{ width: 132, gap: 6 }}>
      <View
        style={{
          height: 72,
          borderRadius: 12,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: colors.neutral[200],
          justifyContent: 'flex-end',
          padding: 8,
        }}
      >
        {showContrast ? (
          <Text style={{ fontSize: 11, fontWeight: '700', color: textColor }}>Aa</Text>
        ) : null}
      </View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.neutral[900] }}>{token}</Text>
      <Text style={{ fontSize: 11, color: colors.neutral[600], fontFamily: 'monospace' }}>{value}</Text>
      {showContrast ? (
        <Text style={{ fontSize: 10, color: colors.neutral[500], lineHeight: 14 }}>
          on {background === '#FFFFFF' ? 'white' : 'surface'}
        </Text>
      ) : null}
    </View>
  );
}

function PaletteRow({
  title,
  description,
  entries,
}: {
  title: string;
  description?: string;
  entries: { token: string; value: string }[];
}) {
  return (
    <View style={{ gap: 10 }}>
      <View>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.neutral[900] }}>{title}</Text>
        {description ? (
          <Text style={{ fontSize: 13, color: colors.neutral[600], lineHeight: 20, marginTop: 2 }}>
            {description}
          </Text>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
        <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 4 }}>
          {entries.map((entry) => (
            <Swatch key={entry.token} token={entry.token} value={entry.value} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function BrandPaletteSection({ id }: { id: BrandColorId }) {
  const token = colors.brand[id];
  const label = brandColorLabel(id);

  return (
    <PaletteRow
      title={`Brand ${label}`}
      description="Climbing difficulty communication and general brand use."
      entries={[
        { token: `brand.${id}.main`, value: token.main },
        { token: `brand.${id}.light`, value: token.light },
        { token: `brand.${id}.dark`, value: token.dark },
        { token: `brand.${id}.accent`, value: token.accent },
        { token: `brand.${id}.contrast.neutral`, value: token.contrast.neutral },
        { token: `brand.${id}.contrast.tonal`, value: token.contrast.tonal },
      ]}
    />
  );
}

function SemanticPaletteSection({ id }: { id: SemanticColorId }) {
  const token = colors.semantic[id];
  const label = semanticColorLabel(id);

  return (
    <PaletteRow
      title={`Semantic ${label}`}
      description="UI feedback and messaging."
      entries={[
        { token: `semantic.${id}.main`, value: token.main },
        { token: `semantic.${id}.light`, value: token.light },
        { token: `semantic.${id}.dark`, value: token.dark },
        { token: `semantic.${id}.accent`, value: token.accent },
        { token: `semantic.${id}.contrast.neutral`, value: token.contrast.neutral },
        { token: `semantic.${id}.contrast.tonal`, value: token.contrast.tonal },
      ]}
    />
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
        <WireframeSection title="Brand colours">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 8 }}>
            Used for climbing difficulty levels and brand accents. Each colour has main, light, dark, accent, and
            suggested contrast text tokens.
          </Text>
          <View style={{ gap: 20 }}>
            {BRAND_COLOR_ORDER.map((id) => (
              <BrandPaletteSection key={id} id={id} />
            ))}
          </View>
        </WireframeSection>
      ) : null}

      {showNeutral ? (
        <WireframeSection title="Neutral (sandy)">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 8 }}>
            50–100 for backgrounds; 800–900 for text.
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
            <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 4 }}>
              {NEUTRAL_SHADES.map((shade) => (
                <Swatch
                  key={shade}
                  token={`neutral.${shade}`}
                  value={colors.neutral[shade]}
                  showContrast={shade >= 400}
                />
              ))}
            </View>
          </ScrollView>
        </WireframeSection>
      ) : null}

      {showSemantic ? (
        <WireframeSection title="Semantic colours">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 8 }}>
            Negative, attention, positive, info, and discovery states.
          </Text>
          <View style={{ gap: 20 }}>
            {SEMANTIC_COLOR_ORDER.map((id) => (
              <SemanticPaletteSection key={id} id={id} />
            ))}
          </View>
        </WireframeSection>
      ) : null}

      {filter === 'all' ? (
        <WireframeSection title="Alpha previews">
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
        </WireframeSection>
      ) : null}

      {filter === 'all' ? (
        <WireframeSection title="Climbing difficulty chips">
          <Text style={{ color: colors.neutral[600], lineHeight: 20, marginBottom: 12 }}>
            How brand colours appear on level labels in the app.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {BRAND_COLOR_ORDER.map((id) => {
              const token = colors.brand[id];
              const text = token.contrast.neutral;
              return (
                <View
                  key={id}
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
              );
            })}
          </View>
        </WireframeSection>
      ) : null}
    </>
  );
}
