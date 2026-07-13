import { Pressable, Text, View } from 'react-native';

import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Section } from '../atoms/Section';
import { MiniBars } from '../molecules/MiniBars';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import type { ClimbingSession, TrendTimeframe } from '../../types/climbingSession';
import {
  computeStandoutTrends,
  durationTrend,
  sessionsInTimeframe,
  warmUpTrend,
} from '../../utils/sessionUtils';

export function DashboardTrends({
  sessions,
  timeframe,
  onTimeframeChange,
}: {
  sessions: ClimbingSession[];
  timeframe: TrendTimeframe;
  onTimeframeChange: (t: TrendTimeframe) => void;
}) {
  const scoped = sessionsInTimeframe(sessions, timeframe);
  const durationData = durationTrend(sessions, timeframe);
  const warmUpData = warmUpTrend(sessions, timeframe);
  const standouts = computeStandoutTrends(sessions, timeframe);

  const difficultyCounts = scoped.reduce<Record<string, number>>((acc, session) => {
    session.climbs.forEach((climb) => {
      const key = climb.levelName ?? 'Unknown';
      acc[key] = (acc[key] ?? 0) + 1;
    });
    return acc;
  }, {});
  const difficultyData = Object.entries(difficultyCounts).map(([label, value]) => ({ label, value }));

  const timeframeLabel =
    timeframe === 'week' ? 'Week' : timeframe === 'month' ? 'Month' : '3 months';

  return (
    <Section title="Trends">
      <Card>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['week', 'month', '3months'] as TrendTimeframe[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => onTimeframeChange(t)}
              style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
            >
              <Text
                style={{
                  fontWeight: timeframe === t ? '700' : '400',
                  textDecorationLine: timeframe === t ? 'underline' : 'none',
                }}
              >
                {t === 'week' ? 'Week' : t === 'month' ? 'Month' : '3 mo'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={{ color: ui.textMuted, fontSize: 13 }}>Showing {timeframeLabel.toLowerCase()} view</Text>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Session duration</Text>
        <MiniBars data={durationData} unit="m" />
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Difficulty trend</Text>
        <MiniBars data={difficultyData} />
      </Card>

      <Card>
        <Text style={{ fontWeight: '700' }}>Warm-up climb count</Text>
        <MiniBars data={warmUpData} />
      </Card>

      {standouts.length ? (
        <Card>
          <Text style={{ fontWeight: '700' }}>Standout climbs</Text>
          {standouts.map((t) => (
            <View key={t.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="sparkle" size="xs" color={ui.text} />
              <Text>
                {t.label}: {t.detail}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}
    </Section>
  );
}
