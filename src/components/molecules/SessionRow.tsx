import { Pressable, View } from 'react-native';

import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { formatSessionDate } from '../../utils/sessionUtils';
import { interactionStyle } from '../../theme/interaction';
import { space } from '../../theme/spacing';

function SessionRowBody({
  date,
  duration,
  climbCount,
  difficultyRange,
  location,
}: {
  date: string;
  duration: string;
  climbCount: number;
  difficultyRange: string;
  location: string;
}) {
  return (
    <View style={{ gap: space[4] }}>
      <Text variant="body" weight="bold">
        {formatSessionDate(date)}
      </Text>
      <Text variant="body">{location}</Text>
      <Text variant="bodySmall">
        {duration} · {climbCount} climb{climbCount === 1 ? '' : 's'} · {difficultyRange}
      </Text>
    </View>
  );
}

export function SessionRow({
  date,
  duration,
  climbCount,
  difficultyRange,
  location,
  onPress,
  framed = true,
}: {
  date: string;
  duration: string;
  climbCount: number;
  difficultyRange: string;
  location: string;
  onPress: () => void;
  /** When false, omit the Card chrome (e.g. already inside a parent Card). */
  framed?: boolean;
}) {
  const body = (
    <SessionRowBody
      date={date}
      duration={duration}
      climbCount={climbCount}
      difficultyRange={difficultyRange}
      location={location}
    />
  );

  return (
    <Pressable onPress={onPress} style={(state) => [{ borderRadius: 8 }, interactionStyle(state)]}>
      {framed ? <Card>{body}</Card> : body}
    </Pressable>
  );
}
