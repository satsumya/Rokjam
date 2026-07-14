import { Pressable, StyleSheet, View, type PressableStateCallbackType } from 'react-native';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import {
  buttonGeometry,
  buttonStyleTokens,
  type ButtonColorStyle,
} from '../../theme/buttonStyles';
import {
  focusRing,
  interactionFlags,
  interactionStyle,
  previewInteractionStyle,
  type PreviewState,
} from '../../theme/interaction';
import type { TextVariant } from '../../theme/typography';

/** Secondary / ghost only — the filled primary is a `colorStyle` (default `style1`). */
export type ButtonVariant = 'secondary' | 'ghost';
export type ButtonSize = 'large' | 'small';
export type { ButtonColorStyle };

const TEXT_VARIANT_FOR_SIZE: Record<ButtonSize, TextVariant> = {
  large: 'bodyLarge',
  small: 'bodySmall',
};

function paddingForSize(size: ButtonSize) {
  return buttonGeometry.padding[size];
}

export function Button({
  label,
  onPress,
  variant,
  size = 'large',
  colorStyle = 'style1',
  disabled,
  previewState,
}: {
  label: string;
  onPress: () => void;
  /** Omit for the filled primary (uses `colorStyle`). */
  variant?: ButtonVariant;
  /** `large` → bodyLarge bold · `small` → bodySmall bold */
  size?: ButtonSize;
  /**
   * Colour style for the filled primary: brand presets (`style1` / `style2`) or a
   * difficulty colour. Ignored when `variant` is `secondary` or `ghost`.
   * Defaults to `style1`.
   */
  colorStyle?: ButtonColorStyle;
  disabled?: boolean;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  const padding = paddingForSize(size);

  if (variant === 'secondary' || variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={(state) => [
          styles.button,
          padding,
          variant === 'secondary' && styles.buttonSecondary,
          variant === 'ghost' && styles.buttonGhost,
          disabled ? styles.buttonDisabled : interactionStyle(state),
          !disabled && previewInteractionStyle(previewState),
        ]}
      >
        <Text
          variant={TEXT_VARIANT_FOR_SIZE[size]}
          weight="bold"
          style={[
            styles.buttonText,
            variant === 'secondary' && styles.buttonTextSecondary,
            variant === 'ghost' && styles.buttonTextGhost,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <StyledColorButton
      label={label}
      onPress={onPress}
      size={size}
      padding={padding}
      colorStyle={colorStyle}
      disabled={disabled}
      previewState={previewState}
    />
  );
}

function StyledColorButton({
  label,
  onPress,
  size,
  padding,
  colorStyle,
  disabled,
  previewState,
}: {
  label: string;
  onPress: () => void;
  size: ButtonSize;
  padding: (typeof buttonGeometry.padding)[ButtonSize];
  colorStyle: ButtonColorStyle;
  disabled?: boolean;
  previewState?: PreviewState;
}) {
  const tokens = buttonStyleTokens(colorStyle);
  const { strokeWidth, shadowOffsetY, borderRadius } = buttonGeometry;

  const isPressed = (state: PressableStateCallbackType) => {
    if (disabled) return false;
    if (previewState === 'pressed') return true;
    return interactionFlags(state).pressed;
  };

  const isHovered = (state: PressableStateCallbackType) => {
    if (disabled) return false;
    if (previewState === 'hover') return true;
    return interactionFlags(state).hovered;
  };

  const isFocused = (state: PressableStateCallbackType) => {
    if (disabled) return false;
    if (previewState === 'focused') return true;
    return interactionFlags(state).focused;
  };

  return (
    <View
      style={[
        {
          backgroundColor: tokens.shadow,
          borderRadius,
          paddingBottom: shadowOffsetY,
        },
        disabled && styles.buttonDisabled,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={(state) => {
          const pressed = isPressed(state);
          const hovered = isHovered(state);
          const focused = isFocused(state);
          return [
            {
              backgroundColor: tokens.fill,
              borderWidth: strokeWidth,
              borderColor: tokens.stroke,
              borderRadius,
              ...padding,
              alignItems: 'center' as const,
              // Sink the face into the shadow band when pressed.
              transform: [{ translateY: pressed ? shadowOffsetY : 0 }],
              opacity: !pressed && hovered ? 0.92 : 1,
            },
            focused ? focusRing : null,
          ];
        }}
      >
        <Text variant={TEXT_VARIANT_FOR_SIZE[size]} weight="bold" style={{ color: tokens.text }}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: ui.primary,
    backgroundColor: ui.primary,
    borderRadius: buttonGeometry.borderRadius,
    alignItems: 'center',
  },
  buttonSecondary: { backgroundColor: ui.surface, borderColor: ui.primary },
  buttonGhost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: ui.primaryText },
  buttonTextSecondary: { color: ui.primary },
  buttonTextGhost: { color: ui.primary, textDecorationLine: 'underline' },
});
