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
      <Text
        variant="bodySmall"
        color={ui.textMuted}
        numberOfLines={1}
        style={{ width: 56, flexShrink: 0 }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          minWidth: 0,
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
      <Text variant="bodySmall" numberOfLines={1} style={{ minWidth: 36, flexShrink: 0, textAlign: 'right' }}>
        {value}
        {unit ?? ''}
      </Text>
    </View>
  );
}
