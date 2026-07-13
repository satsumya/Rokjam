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

import { colors } from './colors';

/** Accessible focus-ring colour — a blue accent distinct from brand fills. */
export const FOCUS_RING_COLOR = colors.brand.blue.accent;

const HOVER_OPACITY = 0.92;
const PRESS_OPACITY = 0.8;

/**
 * Visible keyboard-focus ring. Uses the CSS outline on web (no layout shift);
 * falls back to recolouring the border on native.
 */
export const focusRing = (
  Platform.OS === 'web'
    ? {
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: FOCUS_RING_COLOR,
        outlineOffset: 2,
      }
    : { borderColor: FOCUS_RING_COLOR }
) as ViewStyle;

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
 */
export function interactionStyle(state: PressableStateCallbackType): ViewStyle {
  const { pressed, hovered, focused } = interactionFlags(state);
  return {
    opacity: pressed ? PRESS_OPACITY : hovered ? HOVER_OPACITY : 1,
    ...(focused ? focusRing : null),
  };
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
