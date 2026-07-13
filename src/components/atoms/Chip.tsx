import { Pressable, Text } from 'react-native';

import { ui } from '../../theme/colors';

/** Rounded pill used for tags and suggestions. */
export function Chip({
  label,
  onPress,
  selected = false,
}: {
  label: string;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: selected ? ui.borderStrong : ui.border,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: selected ? ui.surfaceMuted : undefined,
      }}
    >
      <Text>{label}</Text>
    </Pressable>
  );
}

/** Selected tag pill with a remove affordance. */
export function RemovableChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: ui.borderStrong,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: ui.surfaceMuted,
      }}
    >
      <Text>{label}</Text>
      <Text style={{ fontWeight: '700' }}>×</Text>
    </Pressable>
  );
}
