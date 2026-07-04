import { Text, View } from 'react-native';

import { WireframeBox, WireframeSection } from './Wireframe';
import type { ClimbingLog } from '../types/climbingLog';

export function TrendSummary({ logs }: { logs: ClimbingLog[] }) {
  const total = logs.length;
  const sends = logs.filter((log) => log.outcome === 'send' || log.outcome === 'flash').length;
  const working = logs.filter((log) => log.outcome === 'working' || log.outcome === 'project').length;

  const byLocation = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.locationName] = (acc[log.locationName] ?? 0) + 1;
    return acc;
  }, {});

  const byLevel = logs.reduce<Record<string, { count: number; color: string }>>((acc, log) => {
    const current = acc[log.levelName] ?? { count: 0, color: log.levelColor };
    acc[log.levelName] = { count: current.count + 1, color: log.levelColor };
    return acc;
  }, {});

  const topLocation = Object.entries(byLocation).sort((a, b) => b[1] - a[1])[0];

  if (total === 0) {
    return (
      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>No climbs logged yet</Text>
        <Text>Log a climb to see trends here.</Text>
      </WireframeBox>
    );
  }

  return (
    <>
      <WireframeSection title="Summary">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <StatChip label="Total climbs" value={String(total)} />
          <StatChip label="Sends / flashes" value={String(sends)} />
          <StatChip label="Projects" value={String(working)} />
          {topLocation ? (
            <StatChip label="Top location" value={`${topLocation[0]} (${topLocation[1]})`} />
          ) : null}
        </View>
      </WireframeSection>

      <WireframeSection title="By difficulty level">
        <View style={{ gap: 8 }}>
          {Object.entries(byLevel).map(([name, data]) => (
            <View key={name} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      backgroundColor: data.color,
                    }}
                  />
                  <Text>{name}</Text>
                </View>
                <Text>{data.count}</Text>
              </View>
              <View
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#EEE',
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.min(100, (data.count / total) * 100)}%`,
                    height: '100%',
                    backgroundColor: data.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </WireframeSection>
    </>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 10,
        minWidth: 120,
        gap: 4,
      }}
    >
      <Text style={{ color: '#666', fontSize: 13 }}>{label}</Text>
      <Text style={{ fontWeight: '700' }}>{value}</Text>
    </View>
  );
}

export function LogSummaryRow({ log }: { log: ClimbingLog }) {
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            backgroundColor: log.levelColor,
          }}
        />
        <Text style={{ fontWeight: '700', flex: 1 }}>
          {log.routeName || log.levelName}
        </Text>
        <Text style={{ textTransform: 'capitalize' }}>{log.outcome}</Text>
      </View>
      <Text style={{ color: '#666' }}>
        {log.date} · {log.locationName}
      </Text>
    </View>
  );
}
