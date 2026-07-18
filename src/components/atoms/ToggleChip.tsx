import { Pressable } from 'react-native';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';
import { space } from '../../theme/spacing';

/** Compact outlined chip that toggles on/off (tags, attempt progress). */
export function ToggleChip({
  label,
  selected,
  onPress,
  paddingHorizontal = space[12],
  previewState,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  paddingHorizontal?: number;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        { borderRadius: 12, maxWidth: '100%' },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <Text
        variant="bodySmall"
        style={{
          borderWidth: 1,
          borderColor: selected ? ui.borderStrong : ui.border,
          borderRadius: 12,
          paddingHorizontal,
          paddingVertical: space[4],
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
