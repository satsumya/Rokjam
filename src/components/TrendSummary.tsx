import { Pressable, Text, View } from 'react-native';

import { WireframeBox, WireframeSection } from './Wireframe';
import { ui } from '../theme/colors';
import type { ClimbingSession, TrendTimeframe } from '../types/climbingSession';
import {
  computeStandoutTrends,
  durationTrend,
  sessionsInTimeframe,
  warmUpTrend,
} from '../utils/sessionUtils';

function MiniBars({ data, unit }: { data: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (!data.length) {
    return <Text style={{ color: ui.textMuted }}>No data in this timeframe.</Text>;
  }
  return (
    <View style={{ gap: 6 }}>
      {data.map((item) => (
        <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ width: 36, fontSize: 12, color: ui.textMuted }}>{item.label}</Text>
          <View
            style={{
              flex: 1,
              height: 14,
              backgroundColor: ui.borderSubtle,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${(item.value / max) * 100}%`,
                height: '100%',
                backgroundColor: ui.primary,
              }}
            />
          </View>
          <Text style={{ width: 40, fontSize: 12, textAlign: 'right' }}>
            {item.value}
            {unit ?? ''}
          </Text>
        </View>
      ))}
    </View>
  );
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
    <WireframeSection title="Trends">
      <WireframeBox>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['week', 'month', '3months'] as TrendTimeframe[]).map((t) => (
            <Pressable key={t} onPress={() => onTimeframeChange(t)}>
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
      </WireframeBox>

      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>Session duration</Text>
        <MiniBars data={durationData} unit="m" />
      </WireframeBox>

      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>Difficulty trend</Text>
        <MiniBars data={difficultyData} />
      </WireframeBox>

      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>Warm-up climb count</Text>
        <MiniBars data={warmUpData} />
      </WireframeBox>

      {standouts.length ? (
        <WireframeBox>
          <Text style={{ fontWeight: '700' }}>Standout climbs</Text>
          {standouts.map((t) => (
            <Text key={t.label}>
              🎉 {t.label}: {t.detail}
            </Text>
          ))}
        </WireframeBox>
      ) : null}
    </WireframeSection>
  );
}

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
    <WireframeSection title="Community trends">
      <WireframeBox>
        <Text>Public sessions this week: {sessions.length}</Text>
        <Text>Total flashes logged: {flashCount}</Text>
        {topTags.length ? (
          <>
            <Text style={{ fontWeight: '700', marginTop: 4 }}>Popular tags</Text>
            <MiniBars data={topTags} />
          </>
        ) : null}
      </WireframeBox>
    </WireframeSection>
  );
}
