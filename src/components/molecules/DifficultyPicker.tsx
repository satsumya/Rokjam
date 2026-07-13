import { View } from 'react-native';

import { DifficultyChip } from '../atoms/DifficultyChip';
import { Text } from '../atoms/Text';

type Level = { id: string; name: string; color: string };

/** Wrapping row of selectable difficulty chips with a heading. */
export function DifficultyPicker<L extends Level>({
  levels,
  selectedLevelId,
  onSelect,
  title,
  compact = false,
}: {
  levels: L[];
  selectedLevelId?: string;
  onSelect: (level: L) => void;
  title: string;
  compact?: boolean;
}) {
  return (
    <View style={{ gap: compact ? 4 : 6 }}>
      <Text variant={compact ? 'bodySmall' : 'body'} weight="bold">
        {title}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {levels.map((level) => (
          <DifficultyChip
            key={level.id}
            color={level.color}
            name={level.name}
            selected={selectedLevelId === level.id}
            onPress={() => onSelect(level)}
          />
        ))}
      </View>
    </View>
  );
}
