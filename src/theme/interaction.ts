/**
 * Shared hover / press / focus states for interactive components.
 *
 * Hover and focus are web-only at runtime (react-native-web feeds `hovered` and
 * `focused` into the Pressable style callback and fires mouse/focus events);
 * native quietly ignores them. Every interactive component should route through
 * these helpers so states stay visually consistent across the app.
 */
import { useState } from 'react';
import { Platform, type PressableStateCallbackType, type ViewStyle } from 'react-native';

import { focus } from './colors';

const HOVER_OPACITY = 0.92;
const PRESS_OPACITY = 0.8;

/**
 * Builds a keyboard-focus ring from the theme `focus` tokens. Uses the CSS
 * outline on web (no layout shift); falls back to recolouring the border on
 * native. Pass `inverse` for controls that sit on a dark surface.
 */
function buildFocusRing(inverse = false): ViewStyle {
  const color = inverse ? focus.ringInverse : focus.ring;
  return (
    Platform.OS === 'web'
      ? {
          outlineWidth: focus.width,
          outlineStyle: 'solid',
          outlineColor: color,
          outlineOffset: focus.offset,
        }
      : { borderColor: color, borderWidth: focus.width }
  ) as ViewStyle;
}

/** Focus ring for controls on light surfaces (the default). */
export const focusRing = buildFocusRing(false);

/** Focus ring for controls on dark surfaces. */
export const focusRingInverse = buildFocusRing(true);

/**
 * A forced interaction state, used for previews and Storybook controls so a
 * static render can show hover / press / focus without real user interaction.
 */
export type PreviewState = 'default' | 'hover' | 'pressed' | 'focused';

type PressableInteractionState = PressableStateCallbackType & {
  hovered?: boolean;
  focused?: boolean;
};

/** Normalises a Pressable style-callback state into press/hover/focus flags. */
export function interactionFlags(state: PressableStateCallbackType) {
  const s = state as PressableInteractionState;
  return {
    pressed: s.pressed,
    hovered: Boolean(s.hovered),
    focused: Boolean(s.focused),
  };
}

/**
 * Consistent hover/press/focus styling for any Pressable. Spread the result into
 * the component's style array from within its `style={(state) => [...]}` callback.
 * Pass `{ inverse: true }` for controls rendered on a dark surface.
 */
export function interactionStyle(
  state: PressableStateCallbackType,
  options?: { inverse?: boolean },
): ViewStyle {
  const { pressed, hovered, focused } = interactionFlags(state);
  return {
    opacity: pressed ? PRESS_OPACITY : hovered ? HOVER_OPACITY : 1,
    ...(focused ? (options?.inverse ? focusRingInverse : focusRing) : null),
  };
}

/**
 * Style for a forced preview state — returns the same result `interactionStyle`
 * would produce if that state were active. Returns an empty style for
 * `'default'`/undefined, so it can be spread unconditionally into a style array
 * (a real state wins unless a preview state is set).
 */
export function previewInteractionStyle(
  preview?: PreviewState,
  options?: { inverse?: boolean },
): ViewStyle {
  if (!preview || preview === 'default') return {};
  const state = {
    pressed: preview === 'pressed',
    hovered: preview === 'hover',
    focused: preview === 'focused',
  } as PressableInteractionState;
  return interactionStyle(state, options);
}

/**
 * Hover + focus tracking for controls that are not Pressables (e.g. `TextInput`).
 * Spread `bind` onto the control and use the returned flags to drive styling.
 */
export function useHoverFocus() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const bind = {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    ...(Platform.OS === 'web'
      ? {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        }
      : null),
  } as {
    onFocus: () => void;
    onBlur: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };

  return { hovered, focused, bind };
}
