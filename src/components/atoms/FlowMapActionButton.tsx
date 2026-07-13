import { Pressable } from 'react-native';

import { Text } from './Text';
import { colors } from '../../theme/colors';
import { mixHex } from '../../theme/colorUtils';
import { focusRing, interactionFlags, type PreviewState } from '../../theme/interaction';

export type FlowMapActionVariant = 'download' | 'update';

/** Status palettes for flow-map chrome, derived from the brand tokens. */
const FLOW_STATUS = {
  download: {
    border: colors.brand.blue.accent,
    bg: colors.brand.blue.light,
    hoverBg: mixHex(colors.brand.blue.light, colors.brand.blue.accent, 0.12),
    pressedBg: mixHex(colors.brand.blue.light, colors.brand.blue.accent, 0.25),
    text: colors.brand.blue.dark,
  },
  update: {
    border: colors.brand.green.accent,
    bg: colors.brand.green.light,
    hoverBg: mixHex(colors.brand.green.light, colors.brand.green.accent, 0.12),
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
  previewState,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: FlowMapActionVariant;
  disabled?: boolean;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  const palette = variant === 'update' ? FLOW_STATUS.update : FLOW_STATUS.download;
  const borderColor = palette.border;
  const textColor = palette.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={(state) => {
        const flags = interactionFlags(state);
        const pressed = flags.pressed || previewState === 'pressed';
        const hovered = flags.hovered || previewState === 'hover';
        const focused = flags.focused || previewState === 'focused';
        return {
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 5,
          backgroundColor: pressed ? palette.pressedBg : hovered ? palette.hoverBg : palette.bg,
          opacity: disabled ? 0.5 : 1,
          ...(focused && !disabled ? focusRing : null),
        };
      }}
    >
      <Text variant="bodySmall" weight="bold" color={textColor}>
        {label}
      </Text>
    </Pressable>
  );
}
