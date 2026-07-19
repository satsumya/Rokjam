import { useEffect, useState } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

import { Icon } from '../atoms/Icon';
import { Section } from '../atoms/Section';
import { Text } from '../atoms/Text';
import { Dropdown } from '../molecules/Dropdown';
import { ActivityHeatmap } from '../molecules/ActivityHeatmap';
import { MiniBars } from '../molecules/MiniBars';
import { PieChart } from '../molecules/PieChart';
import type { Location } from '../../context/PrototypeContext';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import type { ClimbingSession, TrendTimeframe } from '../../types/climbingSession';
import {
  computeStandoutTrends,
  defaultDifficultyTrendLocationId,
  difficultyTrendByLocation,
  durationHeatmap,
  formatDuration,
  timeframeRangeLabel,
  warmUpTrend,
} from '../../utils/sessionUtils';
import { space } from '../../theme/spacing';

const LOCATION_TAB_LIMIT = 3;

function TrendTimeframeBlock({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TrendTimeframeRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TrendChartBlock({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function DifficultyLocationTabs({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function StandoutClimbRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

export function DashboardTrends({
  sessions,
  locations,
  timeframe,
  onTimeframeChange,
}: {
  sessions: ClimbingSession[];
  locations: Location[];
  timeframe: TrendTimeframe;
  onTimeframeChange: (t: TrendTimeframe) => void;
}) {
  const durationData = durationHeatmap(sessions, timeframe);
  const warmUpData = warmUpTrend(sessions, timeframe);
  const standouts = computeStandoutTrends(sessions, timeframe);
  const difficultyTrends = difficultyTrendByLocation(sessions, timeframe, locations);
  const [difficultyLocationId, setDifficultyLocationId] = useState<string | undefined>(() =>
    defaultDifficultyTrendLocationId(difficultyTrends),
  );

  useEffect(() => {
    const stillValid = difficultyTrends.some((trend) => trend.locationId === difficultyLocationId);
    if (!stillValid) {
      setDifficultyLocationId(defaultDifficultyTrendLocationId(difficultyTrends));
    }
  }, [difficultyTrends, difficultyLocationId]);

  const selectedDifficulty = difficultyTrends.find(
    (trend) => trend.locationId === difficultyLocationId,
  );
  const pieSlices =
    selectedDifficulty?.slices.map((slice) => ({
      label: slice.name,
      value: slice.value,
      color: slice.color,
    })) ?? [];

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
          {timeframeRangeLabel(timeframe)}
        </Text>
      </TrendTimeframeBlock>

      <TrendChartBlock style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          Session duration
        </Text>
        <View style={{ gap: space[4] }}>
          <Text variant="h5">{formatDuration(durationData.totalMinutes)}</Text>
          <Text variant="bodySmall" color={ui.textMuted}>
            Total climbing time
          </Text>
        </View>
        <ActivityHeatmap data={durationData} />
      </TrendChartBlock>

      <TrendChartBlock style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          Difficulty trend
        </Text>
        {difficultyTrends.length === 0 ? (
          <Text variant="body" color={ui.textMuted}>
            No difficulty data in this timeframe.
          </Text>
        ) : (
          <>
            {difficultyTrends.length > 1 ? (
              difficultyTrends.length <= LOCATION_TAB_LIMIT ? (
                <DifficultyLocationTabs
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}
                >
                  {difficultyTrends.map((trend) => {
                    const selected = trend.locationId === difficultyLocationId;
                    return (
                      <Pressable
                        key={trend.locationId}
                        onPress={() => setDifficultyLocationId(trend.locationId)}
                        style={(state) => [
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: space[4],
                            borderRadius: 4,
                          },
                          interactionStyle(state),
                        ]}
                      >
                        {trend.isHome ? (
                          <Icon name="house" size="xs" color={selected ? ui.text : ui.textMuted} />
                        ) : null}
                        <Text
                          variant="body"
                          weight={selected ? 'bold' : 'regular'}
                          style={{ textDecorationLine: selected ? 'underline' : 'none' }}
                        >
                          {trend.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </DifficultyLocationTabs>
              ) : (
                <Dropdown
                  label="Location"
                  value={difficultyLocationId ?? difficultyTrends[0].locationId}
                  options={difficultyTrends.map((trend) => ({
                    value: trend.locationId,
                    label: trend.isHome ? `${trend.label} (home)` : trend.label,
                  }))}
                  onChange={setDifficultyLocationId}
                />
              )
            ) : null}
            <PieChart slices={pieSlices} />
          </>
        )}
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
            <StandoutClimbRow
              key={t.label}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space[6] }}
            >
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
