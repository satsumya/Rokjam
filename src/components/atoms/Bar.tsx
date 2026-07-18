import { View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

function BarRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function BarTrack({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function BarFill({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

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
    <BarRow style={{ flexDirection: 'row', alignItems: 'center', gap: space[8] }}>
      <Text
        variant="bodySmall"
        color={ui.textMuted}
        numberOfLines={1}
        style={{ width: 56, flexShrink: 0 }}
      >
        {label}
      </Text>
      <BarTrack
        style={{
          flex: 1,
          minWidth: 0,
          height: 14,
          backgroundColor: ui.borderSubtle,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <BarFill
          style={{
            width: `${(value / max) * 100}%`,
            height: '100%',
            backgroundColor: ui.primary,
          }}
        />
      </BarTrack>
      <Text variant="bodySmall" numberOfLines={1} style={{ minWidth: 36, flexShrink: 0, textAlign: 'right' }}>
        {value}
        {unit ?? ''}
      </Text>
    </BarRow>
  );
}
