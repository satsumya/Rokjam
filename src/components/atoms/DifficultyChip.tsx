import { Pressable, Text } from 'react-native';

import { LevelDot } from './LevelDot';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';

/** Selectable difficulty pill: colour dot + level name. */
export function DifficultyChip({
  color,
  name,
  selected = false,
  onPress,
}: {
  color: string;
  name: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        {
          borderWidth: 1,
          borderColor: selected ? ui.borderStrong : ui.border,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        interactionStyle(state),
      ]}
    >
      <LevelDot color={color} size={10} />
      <Text>{name}</Text>
    </Pressable>
  );
}
