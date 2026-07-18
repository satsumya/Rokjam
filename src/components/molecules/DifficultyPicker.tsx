import { View, type ViewProps } from 'react-native';

import { DifficultyChip } from '../atoms/DifficultyChip';
import { Text } from '../atoms/Text';
import { space } from '../../theme/spacing';

type Level = { id: string; name: string; color: string };

function DifficultyPickerRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function DifficultyChipRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

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
    <DifficultyPickerRoot style={{ gap: compact ? 4 : 6 }}>
      <Text variant={compact ? 'bodySmall' : 'body'} weight="bold">
        {title}
      </Text>
      <DifficultyChipRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[6] }}>
        {levels.map((level) => (
          <DifficultyChip
            key={level.id}
            color={level.color}
            name={level.name}
            selected={selectedLevelId === level.id}
            onPress={() => onSelect(level)}
          />
        ))}
      </DifficultyChipRow>
    </DifficultyPickerRoot>
  );
}
