import { Pressable, Text } from 'react-native';

import { ui } from '../../theme/colors';
import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';

/** Compact outlined chip that toggles on/off (tags, attempt progress). */
export function ToggleChip({
  label,
  selected,
  onPress,
  paddingHorizontal = 10,
  fontSize,
  previewState,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  paddingHorizontal?: number;
  fontSize?: number;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        { borderRadius: 12 },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <Text
        style={{
          borderWidth: 1,
          borderColor: selected ? ui.borderStrong : ui.border,
          borderRadius: 12,
          paddingHorizontal,
          paddingVertical: 4,
          fontSize,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
