import { Pressable, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { mixHex } from '../../theme/colorUtils';

export type FlowMapActionVariant = 'download' | 'update';

/** Status palettes for flow-map chrome, derived from the brand tokens. */
const FLOW_STATUS = {
  download: {
    border: colors.brand.blue.accent,
    bg: colors.brand.blue.light,
    pressedBg: mixHex(colors.brand.blue.light, colors.brand.blue.accent, 0.25),
    text: colors.brand.blue.dark,
  },
  update: {
    border: colors.brand.green.accent,
    bg: colors.brand.green.light,
    pressedBg: mixHex(colors.brand.green.light, colors.brand.green.accent, 0.25),
    text: colors.brand.green.dark,
  },
} as const;

export function FlowMapActionButton({
  label,
  onPress,
  accessibilityLabel,
  variant = 'download',
  disabled,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: FlowMapActionVariant;
  disabled?: boolean;
}) {
  const palette = variant === 'update' ? FLOW_STATUS.update : FLOW_STATUS.download;
  const borderColor = palette.border;
  const backgroundColor = palette.bg;
  const pressedBg = palette.pressedBg;
  const textColor = palette.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: pressed ? pressedBg : backgroundColor,
        opacity: disabled ? 0.5 : 1,
      })}
    >
      <Text style={{ fontSize: 12, fontWeight: '600', color: textColor }}>{label}</Text>
    </Pressable>
  );
}
