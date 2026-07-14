import { View } from 'react-native';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

/** Single labelled horizontal bar for the mini bar charts. */
export function Bar({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[8] }}>
      <Text variant="bodySmall" color={ui.textMuted} style={{ width: 36 }}>
        {label}
      </Text>
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
            width: `${(value / max) * 100}%`,
            height: '100%',
            backgroundColor: ui.primary,
          }}
        />
      </View>
      <Text variant="bodySmall" style={{ width: 40, textAlign: 'right' }}>
        {value}
        {unit ?? ''}
      </Text>
    </View>
  );
}
