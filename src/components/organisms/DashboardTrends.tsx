import { Pressable, View, type ViewProps } from 'react-native';

import { Icon } from '../atoms/Icon';
import { Section } from '../atoms/Section';
import { Text } from '../atoms/Text';
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
import { space } from '../../theme/spacing';

function TrendTimeframeBlock({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TrendTimeframeRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TrendChartBlock({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function StandoutClimbRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

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
      <TrendTimeframeBlock style={{ gap: space[4] }}>
        <TrendTimeframeRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
          {(['week', 'month', '3months'] as TrendTimeframe[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => onTimeframeChange(t)}
              style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
            >
              <Text
                variant="body"
                weight={timeframe === t ? 'bold' : 'regular'}
                style={{ textDecorationLine: timeframe === t ? 'underline' : 'none' }}
              >
                {t === 'week' ? 'Week' : t === 'month' ? 'Month' : '3 mo'}
              </Text>
            </Pressable>
          ))}
        </TrendTimeframeRow>
        <Text variant="bodySmall" color={ui.textMuted}>
          Showing {timeframeLabel.toLowerCase()} view
        </Text>
      </TrendTimeframeBlock>

      <TrendChartBlock style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          Session duration
        </Text>
        <MiniBars data={durationData} unit="m" />
      </TrendChartBlock>

      <TrendChartBlock style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          Difficulty trend
        </Text>
        <MiniBars data={difficultyData} />
      </TrendChartBlock>

      <TrendChartBlock style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          Warm-up climb count
        </Text>
        <MiniBars data={warmUpData} />
      </TrendChartBlock>

      {standouts.length ? (
        <TrendChartBlock style={{ gap: space[8] }}>
          <Text variant="body" weight="bold">
            Standout climbs
          </Text>
          {standouts.map((t) => (
            <StandoutClimbRow key={t.label} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space[6] }}>
              <Icon name="sparkle" size="xs" color={ui.text} />
              <Text variant="body" style={{ flex: 1, minWidth: 0 }}>
                {t.label}: {t.detail}
              </Text>
            </StandoutClimbRow>
          ))}
        </TrendChartBlock>
      ) : null}
    </Section>
  );
}
