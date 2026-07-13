import { Text, View } from 'react-native';

import { ui } from '../../theme/colors';

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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text style={{ width: 36, fontSize: 12, color: ui.textMuted }}>{label}</Text>
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
      <Text style={{ width: 40, fontSize: 12, textAlign: 'right' }}>
        {value}
        {unit ?? ''}
      </Text>
    </View>
  );
}
