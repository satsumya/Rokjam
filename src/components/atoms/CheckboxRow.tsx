import { Pressable, Text } from 'react-native';

import { interactionStyle } from '../../theme/interaction';

/** Inline checkbox row rendered as `☑/☐ label`. */
export function CheckboxRow({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}>
      <Text>
        {checked ? '☑' : '☐'} {label}
      </Text>
    </Pressable>
  );
}
