import { Text, View } from 'react-native';

import { Icon } from './Icon';
import { colors } from '../../theme/colors';
import { contrastRatio, formatContrastRatio, wcagAaStatus } from '../../theme/colorUtils';

export type ContrastPreview = {
  label: string;
  token: string;
  color: string;
};

export function WcagAaCheck({
  foreground,
  background,
}: {
  foreground: string;
  background: string;
}) {
  const aa = wcagAaStatus(foreground, background);

  return (
    <View style={{ gap: 2, marginTop: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <Text
          style={{
            fontSize: 10,
            lineHeight: 14,
            color: aa.passesNormalText ? colors.brand.green.dark : colors.brand.red.main,
            fontWeight: '600',
          }}
        >
          AA normal {formatContrastRatio(aa.ratio)}
        </Text>
        <Icon
          name={aa.passesNormalText ? 'check' : 'close'}
          size="xs"
          color={aa.passesNormalText ? colors.brand.green.dark : colors.brand.red.main}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <Text
          style={{
            fontSize: 10,
            lineHeight: 14,
            color: aa.passesLargeText ? colors.brand.green.dark : colors.neutral[500],
          }}
        >
          AA large
        </Text>
        <Icon
          name={aa.passesLargeText ? 'check' : 'close'}
          size="xs"
          color={aa.passesLargeText ? colors.brand.green.dark : colors.neutral[500]}
        />
        <Text
          style={{
            fontSize: 10,
            lineHeight: 14,
            color: aa.passesLargeText ? colors.brand.green.dark : colors.neutral[500],
          }}
        >
          (3:1)
        </Text>
      </View>
    </View>
  );
}

export function ShadeSwatch({
  token,
  background,
  contrasts = [],
  accentBorder,
}: {
  token: string;
  background: string;
  contrasts?: ContrastPreview[];
  accentBorder?: string;
}) {
  const shadeBackground = accentBorder ? colors.neutral[50] : background;

  return (
    <View style={{ width: 156, gap: 6 }}>
      <View
        style={{
          minHeight: 88,
          borderRadius: 12,
          backgroundColor: accentBorder ? colors.neutral[50] : background,
          borderWidth: accentBorder ? 3 : 1,
          borderColor: accentBorder ?? colors.neutral[200],
          justifyContent: 'flex-end',
          padding: 10,
          gap: 4,
        }}
      >
        {contrasts.length ? (
          contrasts.map((contrast) => (
            <View key={contrast.token} style={{ gap: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: contrast.color }}>Aa</Text>
              <Text style={{ fontSize: 9, fontWeight: '600', color: contrast.color, opacity: 0.85 }}>
                {contrast.label}
              </Text>
            </View>
          ))
        ) : accentBorder ? (
          <Text style={{ fontSize: 10, fontWeight: '600', color: colors.neutral[600] }}>Border / icon</Text>
        ) : null}
      </View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.neutral[900] }}>{token}</Text>
      <Text style={{ fontSize: 11, color: colors.neutral[600], fontFamily: 'monospace' }}>
        {accentBorder ?? background}
      </Text>
      {contrasts.map((contrast) => (
        <View key={`${contrast.token}-meta`}>
          <Text style={{ fontSize: 10, color: colors.neutral[500], lineHeight: 14 }}>
            {contrast.token}: {contrast.color}
          </Text>
          <WcagAaCheck foreground={contrast.color} background={shadeBackground} />
        </View>
      ))}
    </View>
  );
}

export function Swatch({ token, value }: { token: string; value: string }) {
  const fg =
    contrastRatio(colors.neutral[900], value) >= contrastRatio(colors.neutral[50], value)
      ? colors.neutral[900]
      : colors.neutral[50];

  return (
    <View style={{ width: 140, gap: 6 }}>
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
        <Text style={{ fontSize: 11, fontWeight: '700', color: fg }}>Aa</Text>
      </View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.neutral[900] }}>{token}</Text>
      <Text style={{ fontSize: 11, color: colors.neutral[600], fontFamily: 'monospace' }}>{value}</Text>
    </View>
  );
}
