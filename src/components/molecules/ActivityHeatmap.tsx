import { View, type ViewProps } from 'react-native';

import { Text } from '../atoms/Text';
import { colors, ui } from '../../theme/colors';
import type { DurationHeatmap, HeatmapLevel } from '../../utils/sessionUtils';
import { space } from '../../theme/spacing';

const CELL = 12;
const GAP = 3;
const DAY_LABEL_WIDTH = 28;

const LEVEL_COLORS: Record<HeatmapLevel, string> = {
  0: ui.borderSubtle,
  1: colors.brand.green.light,
  2: colors.brand.green.main,
  3: colors.brand.green.accent,
  4: colors.brand.green.dark,
};

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const;

function HeatmapRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HeatmapMonthRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HeatmapGrid({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HeatmapDayColumn({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HeatmapWeekColumn({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HeatmapCell({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HeatmapLegend({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Contribution-style grid of climbing time — darker green = longer session day. */
export function ActivityHeatmap({ data }: { data: DurationHeatmap }) {
  const { weeks, monthLabels } = data;
  if (!weeks.length) {
    return (
      <Text variant="body" color={ui.textMuted}>
        No sessions in this timeframe.
      </Text>
    );
  }

  const labelByWeek = new Map(monthLabels.map((item) => [item.weekIndex, item.label]));

  return (
    <HeatmapRoot style={{ gap: space[8] }}>
      <HeatmapMonthRow style={{ flexDirection: 'row', marginLeft: DAY_LABEL_WIDTH + GAP }}>
        {weeks.map((_, weekIndex) => (
          <View key={`month-${weekIndex}`} style={{ width: CELL + GAP }}>
            {labelByWeek.has(weekIndex) ? (
              <Text variant="bodySmall" color={ui.textMuted} numberOfLines={1}>
                {labelByWeek.get(weekIndex)}
              </Text>
            ) : null}
          </View>
        ))}
      </HeatmapMonthRow>

      <HeatmapGrid style={{ flexDirection: 'row', gap: GAP }}>
        <HeatmapDayColumn style={{ width: DAY_LABEL_WIDTH, gap: GAP, paddingTop: 0 }}>
          {DAY_LABELS.map((label, index) => (
            <View
              key={`day-label-${index}`}
              style={{ height: CELL, justifyContent: 'center' }}
            >
              {label ? (
                <Text variant="bodySmall" color={ui.textMuted} numberOfLines={1}>
                  {label}
                </Text>
              ) : null}
            </View>
          ))}
        </HeatmapDayColumn>

        {weeks.map((week, weekIndex) => (
          <HeatmapWeekColumn key={`week-${weekIndex}`} style={{ gap: GAP }}>
            {week.map((day) => (
              <HeatmapCell
                key={day.date}
                accessibilityLabel={
                  day.inRange
                    ? `${day.date}: ${day.minutes > 0 ? `${day.minutes} minutes` : 'no session'}`
                    : undefined
                }
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 2,
                  backgroundColor: day.inRange ? LEVEL_COLORS[day.level] : ui.surfaceMuted,
                  opacity: day.inRange ? 1 : 0.45,
                }}
              />
            ))}
          </HeatmapWeekColumn>
        ))}
      </HeatmapGrid>

      <HeatmapLegend
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[4],
          alignSelf: 'flex-end',
        }}
      >
        <Text variant="bodySmall" color={ui.textMuted}>
          Less
        </Text>
        {([0, 1, 2, 3, 4] as HeatmapLevel[]).map((level) => (
          <HeatmapCell
            key={`legend-${level}`}
            style={{
              width: CELL,
              height: CELL,
              borderRadius: 2,
              backgroundColor: LEVEL_COLORS[level],
            }}
          />
        ))}
        <Text variant="bodySmall" color={ui.textMuted}>
          More
        </Text>
      </HeatmapLegend>
    </HeatmapRoot>
  );
}
