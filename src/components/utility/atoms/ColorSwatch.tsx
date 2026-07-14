import { View } from 'react-native';

import { Icon } from '../../atoms/Icon';
import { Text } from '../../atoms/Text';
import { colors } from '../../../theme/colors';
import { contrastRatio, formatContrastRatio, wcagAaStatus } from '../../../theme/colorUtils';
import { space } from '../../../theme/spacing';

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
    <View style={{ gap: space[4], marginTop: space[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
        <Text
          variant="bodySmall"
          weight="bold"
          color={aa.passesNormalText ? colors.brand.green.dark : colors.brand.red.main}
          style={{ fontSize: 10, lineHeight: 14 }}
        >
          AA normal {formatContrastRatio(aa.ratio)}
        </Text>
        <Icon
          name={aa.passesNormalText ? 'check' : 'close'}
          size="xs"
          color={aa.passesNormalText ? colors.brand.green.dark : colors.brand.red.main}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
        <Text
          variant="bodySmall"
          color={aa.passesLargeText ? colors.brand.green.dark : colors.neutral[500]}
          style={{ fontSize: 10, lineHeight: 14 }}
        >
          AA large
        </Text>
        <Icon
          name={aa.passesLargeText ? 'check' : 'close'}
          size="xs"
          color={aa.passesLargeText ? colors.brand.green.dark : colors.neutral[500]}
        />
        <Text
          variant="bodySmall"
          color={aa.passesLargeText ? colors.brand.green.dark : colors.neutral[500]}
          style={{ fontSize: 10, lineHeight: 14 }}
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
    <View style={{ width: 156, gap: space[6] }}>
      <View
        style={{
          minHeight: 88,
          borderRadius: 12,
          backgroundColor: accentBorder ? colors.neutral[50] : background,
          borderWidth: accentBorder ? 3 : 1,
          borderColor: accentBorder ?? colors.neutral[200],
          justifyContent: 'flex-end',
          padding: space[12],
          gap: space[4],
        }}
      >
        {contrasts.length ? (
          contrasts.map((contrast) => (
            <View key={contrast.token} style={{ gap: space[4] }}>
              <Text variant="bodySmall" weight="bold" color={contrast.color} style={{ fontSize: 13 }}>
                Aa
              </Text>
              <Text
                variant="bodySmall"
                weight="bold"
                color={contrast.color}
                style={{ fontSize: 9, opacity: 0.85 }}
              >
                {contrast.label}
              </Text>
            </View>
          ))
        ) : accentBorder ? (
          <Text variant="bodySmall" weight="bold" color={colors.neutral[600]} style={{ fontSize: 10 }}>
            Border / icon
          </Text>
        ) : null}
      </View>
      <Text variant="bodySmall" weight="bold" color={colors.neutral[900]}>
        {token}
      </Text>
      <Text
        variant="bodySmall"
        color={colors.neutral[600]}
        style={{ fontSize: 11, fontFamily: 'monospace' }}
      >
        {accentBorder ?? background}
      </Text>
      {contrasts.map((contrast) => (
        <View key={`${contrast.token}-meta`}>
          <Text variant="bodySmall" color={colors.neutral[500]} style={{ fontSize: 10, lineHeight: 14 }}>
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
    <View style={{ width: 140, gap: space[6] }}>
      <View
        style={{
          height: 72,
          borderRadius: 12,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: colors.neutral[200],
          justifyContent: 'flex-end',
          padding: space[8],
        }}
      >
        <Text variant="bodySmall" weight="bold" color={fg} style={{ fontSize: 11 }}>
          Aa
        </Text>
      </View>
      <Text variant="bodySmall" weight="bold" color={colors.neutral[900]}>
        {token}
      </Text>
      <Text
        variant="bodySmall"
        color={colors.neutral[600]}
        style={{ fontSize: 11, fontFamily: 'monospace' }}
      >
        {value}
      </Text>
    </View>
  );
}
