import { Pressable, Text } from 'react-native';

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
    <Pressable onPress={onPress}>
      <Text>
        {checked ? '☑' : '☐'} {label}
      </Text>
    </Pressable>
  );
}
