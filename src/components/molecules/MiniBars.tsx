import { View, type ViewProps } from 'react-native';

import { Bar } from '../atoms/Bar';
import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

function MiniBarsStack({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

export function MiniBars({ data, unit }: { data: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (!data.length) {
    return (
      <Text variant="body" color={ui.textMuted}>
        No data in this timeframe.
      </Text>
    );
  }
  return (
    <MiniBarsStack style={{ gap: space[6] }}>
      {data.map((item) => (
        <Bar key={item.label} label={item.label} value={item.value} max={max} unit={unit} />
      ))}
    </MiniBarsStack>
  );
}
