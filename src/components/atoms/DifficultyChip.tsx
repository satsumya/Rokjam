import { Pressable } from 'react-native';

import { LevelDot } from './LevelDot';
import { Text } from './Text';
import { ui } from '../../theme/colors';
import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';
import { space } from '../../theme/spacing';

/** Selectable difficulty pill: colour dot + level name. */
export function DifficultyChip({
  color,
  name,
  selected = false,
  onPress,
  previewState,
}: {
  color: string;
  name: string;
  selected?: boolean;
  onPress: () => void;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        {
          borderWidth: 1,
          borderColor: selected ? ui.borderStrong : ui.border,
          borderRadius: 12,
          paddingHorizontal: space[12],
          paddingVertical: space[6],
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[4],
        },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <LevelDot color={color} size={10} />
      <Text variant="body">{name}</Text>
    </Pressable>
  );
}
