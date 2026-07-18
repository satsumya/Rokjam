import { Pressable, StyleSheet, View, type PressableStateCallbackType, type ViewProps } from 'react-native';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';
import { ui } from '../../theme/colors';
import {
  buttonGeometry,
  buttonStyleTokens,
  type ButtonColorStyle,
} from '../../theme/buttonStyles';
import type { IconSize } from '../../theme/icon';
import {
  focusRing,
  interactionFlags,
  interactionStyle,
  previewInteractionStyle,
  type PreviewState,
} from '../../theme/interaction';
import { space } from '../../theme/spacing';
import type { TextVariant } from '../../theme/typography';

/** Filled primary uses `colorStyle`; secondary / ghost are outline / text styles. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
/** Maps to the body type scale: large → bodyLarge · medium → body · small → bodySmall. */
export type ButtonSize = 'large' | 'medium' | 'small';
export type { ButtonColorStyle };

const TEXT_VARIANT_FOR_SIZE: Record<ButtonSize, TextVariant> = {
  large: 'bodyLarge',
  medium: 'body',
  small: 'bodySmall',
};

/** Icon beside a label — sized to sit with the text scale. */
const ICON_SIZE_WITH_LABEL: Record<ButtonSize, IconSize> = {
  large: 'md',
  medium: 'sm',
  small: 'xs',
};

/** Icon-only — button size maps 1:1 to icon size (small→sm · medium→md · large→lg). */
const ICON_SIZE_ICON_ONLY: Record<ButtonSize, IconSize> = {
  large: 'lg',
  medium: 'md',
  small: 'sm',
};

function paddingForSize(size: ButtonSize, iconOnly: boolean) {
  return iconOnly ? buttonGeometry.iconOnlyPadding[size] : buttonGeometry.padding[size];
}

function ButtonLabelRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ButtonShadow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ButtonContent({
  label,
  icon,
  iconLeft,
  iconRight,
  size,
  color,
  ghostUnderline,
}: {
  label?: string;
  icon?: IconName;
  iconLeft?: IconName;
  iconRight?: IconName;
  size: ButtonSize;
  color: string;
  ghostUnderline?: boolean;
}) {
  const iconOnly = Boolean(icon) && !label;
  const iconSize = iconOnly ? ICON_SIZE_ICON_ONLY[size] : ICON_SIZE_WITH_LABEL[size];

  if (iconOnly) {
    return <Icon name={icon!} size={iconSize} color={color} />;
  }

  return (
    <ButtonLabelRow style={styles.contentRow}>
      {iconLeft ? <Icon name={iconLeft} size={iconSize} color={color} /> : null}
      {label ? (
        <Text
          variant={TEXT_VARIANT_FOR_SIZE[size]}
          weight="bold"
          style={[{ color, textAlign: 'center' }, ghostUnderline ? styles.ghostUnderline : null]}
        >
          {label}
        </Text>
      ) : null}
      {iconRight ? <Icon name={iconRight} size={iconSize} color={color} /> : null}
    </ButtonLabelRow>
  );
}

export function Button({
  label,
  icon,
  iconLeft,
  iconRight,
  onPress,
  variant,
  size = 'large',
  colorStyle = 'style1',
  disabled,
  previewState,
  accessibilityLabel,
}: {
  /** Button label. Omit when using `icon` for an icon-only control. */
  label?: string;
  /**
   * Icon-only button — same styles as labelled buttons. Requires
   * `accessibilityLabel` when `label` is omitted.
   */
  icon?: IconName;
  /** Optional icon before the label. */
  iconLeft?: IconName;
  /** Optional icon after the label. */
  iconRight?: IconName;
  onPress: () => void;
  /**
   * Visual style. `primary` (default) is the filled button and uses `colorStyle`
   * (`style1` / `style2` / difficulty colours). `secondary` and `ghost` ignore `colorStyle`.
   */
  variant?: ButtonVariant;
  /** `large` → bodyLarge bold · `medium` → body bold · `small` → bodySmall bold */
  size?: ButtonSize;
  /**
   * Colour style for the filled primary: brand presets (`style1` / `style2`) or a
   * difficulty colour. Only applies when `variant` is `primary`.
   * Defaults to `style1`.
   */
  colorStyle?: ButtonColorStyle;
  disabled?: boolean;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
  /** Required for icon-only buttons; optional otherwise (falls back to `label`). */
  accessibilityLabel?: string;
}) {
  const resolvedVariant = variant ?? 'primary';
  const iconOnly = Boolean(icon) && !label;
  if (iconOnly && !accessibilityLabel) {
    if (__DEV__) {
      console.warn('Button: icon-only buttons require accessibilityLabel');
    }
  }

  const padding = paddingForSize(size, iconOnly);
  const a11yLabel = accessibilityLabel ?? label;

  if (resolvedVariant === 'secondary' || resolvedVariant === 'ghost') {
    const textColor = ui.primary;
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        style={(state) => [
          styles.button,
          padding,
          iconOnly && styles.iconOnly,
          resolvedVariant === 'secondary' && styles.buttonSecondary,
          resolvedVariant === 'ghost' && styles.buttonGhost,
          disabled ? styles.buttonDisabled : interactionStyle(state),
          !disabled && previewInteractionStyle(previewState),
        ]}
      >
        <ButtonContent
          label={label}
          icon={icon}
          iconLeft={iconLeft}
          iconRight={iconRight}
          size={size}
          color={textColor}
          ghostUnderline={resolvedVariant === 'ghost' && Boolean(label)}
        />
      </Pressable>
    );
  }

  return (
    <PrimaryButton
      label={label}
      icon={icon}
      iconLeft={iconLeft}
      iconRight={iconRight}
      iconOnly={iconOnly}
      onPress={onPress}
      size={size}
      padding={padding}
      colorStyle={colorStyle}
      disabled={disabled}
      previewState={previewState}
      accessibilityLabel={a11yLabel}
    />
  );
}

function PrimaryButton({
  label,
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  onPress,
  size,
  padding,
  colorStyle,
  disabled,
  previewState,
  accessibilityLabel,
}: {
  label?: string;
  icon?: IconName;
  iconLeft?: IconName;
  iconRight?: IconName;
  iconOnly: boolean;
  onPress: () => void;
  size: ButtonSize;
  padding: { paddingVertical: number; paddingHorizontal: number };
  colorStyle: ButtonColorStyle;
  disabled?: boolean;
  previewState?: PreviewState;
  accessibilityLabel?: string;
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
    <ButtonShadow
      style={[
        {
          backgroundColor: tokens.shadow,
          borderRadius,
          paddingBottom: shadowOffsetY,
          maxWidth: '100%',
          alignSelf: iconOnly ? 'flex-start' : undefined,
        },
        disabled && styles.buttonDisabled,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
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
              justifyContent: 'center' as const,
              // Sink the face into the shadow band when pressed.
              transform: [{ translateY: pressed ? shadowOffsetY : 0 }],
              opacity: !pressed && hovered ? 0.92 : 1,
            },
            focused ? focusRing : null,
          ];
        }}
      >
        <ButtonContent
          label={label}
          icon={icon}
          iconLeft={iconLeft}
          iconRight={iconRight}
          size={size}
          color={tokens.text}
        />
      </Pressable>
    </ButtonShadow>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: ui.primary,
    backgroundColor: ui.primary,
    borderRadius: buttonGeometry.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  iconOnly: {
    alignSelf: 'flex-start',
  },
  buttonSecondary: { backgroundColor: ui.surface, borderColor: ui.primary },
  buttonGhost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  buttonDisabled: { opacity: 0.4 },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[6],
  },
  ghostUnderline: { textDecorationLine: 'underline' },
});
