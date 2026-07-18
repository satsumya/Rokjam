import { View } from 'react-native';

import { Section } from '../atoms/Section';
import { Text } from '../atoms/Text';
import { MiniBars } from '../molecules/MiniBars';
import type { ClimbingSession } from '../../types/climbingSession';
import { space } from '../../theme/spacing';

export function CommunityTrends({ sessions }: { sessions: ClimbingSession[] }) {
  const tagCounts = sessions.reduce<Record<string, number>>((acc, session) => {
    session.climbs.forEach((climb) => {
      climb.tags.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
    });
    return acc;
  }, {});
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, value]) => ({ label, value }));

  const flashCount = sessions.reduce(
    (n, s) =>
      n +
      s.climbs.filter((c) => c.attempts.some((a) => a.progress.includes('flash'))).length,
    0,
  );

  return (
    <Section title="Community trends">
      <Text variant="body">Public sessions this week: {sessions.length}</Text>
      <Text variant="body">Total flashes logged: {flashCount}</Text>
      {topTags.length ? (
        <View style={{ gap: space[8] }}>
          <Text variant="body" weight="bold">
            Popular tags
          </Text>
          <MiniBars data={topTags} />
        </View>
      ) : null}
    </Section>
  );
}
