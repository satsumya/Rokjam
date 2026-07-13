import { StyleSheet, Text, View } from 'react-native';

import { Icon } from './Icon';
import { ui } from '../../theme/colors';

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
          <Text style={[styles.hintItem, item.met && styles.hintItemMet]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hintList: { gap: 4 },
  hintItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintItem: { color: ui.textSubtle, fontSize: 13 },
  hintItemMet: { color: ui.success },
});
