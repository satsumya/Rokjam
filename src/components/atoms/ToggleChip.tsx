import { Pressable, Text } from 'react-native';

import { ui } from '../../theme/colors';

/** Compact outlined chip that toggles on/off (tags, attempt progress). */
export function ToggleChip({
  label,
  selected,
  onPress,
  paddingHorizontal = 10,
  fontSize,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  paddingHorizontal?: number;
  fontSize?: number;
}) {
  return (
    <Pressable onPress={onPress}>
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
