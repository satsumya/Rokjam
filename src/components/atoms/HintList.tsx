import { StyleSheet, View, type ViewProps } from 'react-native';

import { Icon } from './Icon';
import { Text } from './Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

function HintListRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function HintItem({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

export function HintList({ items }: { items: { label: string; met: boolean }[] }) {
  return (
    <HintListRoot style={styles.hintList}>
      {items.map((item) => (
        <HintItem key={item.label} style={styles.hintItemRow}>
          <Icon
            name={item.met ? 'checkCircle' : 'circle'}
            size="xs"
            color={item.met ? ui.success : ui.textSubtle}
            weight={item.met ? 'fill' : 'regular'}
          />
          <Text variant="bodySmall" color={item.met ? ui.success : ui.textSubtle} style={{ flex: 1, minWidth: 0 }}>
            {item.label}
          </Text>
        </HintItem>
      ))}
    </HintListRoot>
  );
}

const styles = StyleSheet.create({
  hintList: { gap: space[4] },
  hintItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space[6] },
});
