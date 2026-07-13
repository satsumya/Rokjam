import { Pressable, Text } from 'react-native';

import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';

/** Inline checkbox row rendered as `☑/☐ label`. */
export function CheckboxRow({
  label,
  checked,
  onPress,
  previewState,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        { borderRadius: 4 },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <Text>
        {checked ? '☑' : '☐'} {label}
      </Text>
    </Pressable>
  );
}
