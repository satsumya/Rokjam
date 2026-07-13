import { Text, View } from 'react-native';

import { Bar } from '../atoms/Bar';
import { ui } from '../../theme/colors';

export function MiniBars({ data, unit }: { data: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (!data.length) {
    return <Text style={{ color: ui.textMuted }}>No data in this timeframe.</Text>;
  }
  return (
    <View style={{ gap: 6 }}>
      {data.map((item) => (
        <Bar key={item.label} label={item.label} value={item.value} max={max} unit={unit} />
      ))}
    </View>
  );
}
