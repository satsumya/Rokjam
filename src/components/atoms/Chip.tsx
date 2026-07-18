import { Pressable } from 'react-native';

import { Icon } from './Icon';
import { Text } from './Text';
import { ui } from '../../theme/colors';
import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';
import { space } from '../../theme/spacing';

/** Rounded pill used for tags and suggestions. */
export function Chip({
  label,
  onPress,
  selected = false,
  previewState,
}: {
  label: string;
  onPress: () => void;
  selected?: boolean;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        {
          maxWidth: '100%',
          borderWidth: 1,
          borderColor: selected ? ui.borderStrong : ui.border,
          borderRadius: 16,
          paddingHorizontal: space[12],
          paddingVertical: space[6],
          backgroundColor: selected ? ui.surfaceMuted : undefined,
        },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <Text variant="body">{label}</Text>
    </Pressable>
  );
}

/** Selected tag pill with a remove affordance. */
export function RemovableChip({
  label,
  onPress,
  previewState,
}: {
  label: string;
  onPress: () => void;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        {
          maxWidth: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[6],
          borderWidth: 1,
          borderColor: ui.borderStrong,
          borderRadius: 16,
          paddingHorizontal: space[12],
          paddingVertical: space[6],
          backgroundColor: ui.surfaceMuted,
        },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <Text variant="body" style={{ flexShrink: 1 }}>
        {label}
      </Text>
      <Icon name="close" size="xs" color={ui.text} />
    </Pressable>
  );
}
