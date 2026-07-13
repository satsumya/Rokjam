import { Pressable } from 'react-native';

import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { formatSessionDate } from '../../utils/sessionUtils';
import { interactionStyle } from '../../theme/interaction';

export function SessionRow({
  date,
  duration,
  climbCount,
  difficultyRange,
  location,
  onPress,
}: {
  date: string;
  duration: string;
  climbCount: number;
  difficultyRange: string;
  location: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={(state) => [{ borderRadius: 8 }, interactionStyle(state)]}>
      <Card>
        <Text variant="body" weight="bold">
          {formatSessionDate(date)}
        </Text>
        <Text variant="body">{location}</Text>
        <Text variant="bodySmall">
          {duration} · {climbCount} climb{climbCount === 1 ? '' : 's'} · {difficultyRange}
        </Text>
      </Card>
    </Pressable>
  );
}
