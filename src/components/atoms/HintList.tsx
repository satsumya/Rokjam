import { StyleSheet, View } from 'react-native';

import { Icon } from './Icon';
import { Text } from './Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export function HintList({ items }: { items: { label: string; met: boolean }[] }) {
  return (
    <View style={styles.hintList}>
      {items.map((item) => (
        <View key={item.label} style={styles.hintItemRow}>
          <Icon
            name={item.met ? 'checkCircle' : 'circle'}
            size="xs"
            color={item.met ? ui.success : ui.textSubtle}
            weight={item.met ? 'fill' : 'regular'}
          />
          <Text variant="bodySmall" color={item.met ? ui.success : ui.textSubtle}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hintList: { gap: space[4] },
  hintItemRow: { flexDirection: 'row', alignItems: 'center', gap: space[6] },
});
