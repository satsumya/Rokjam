import { StyleSheet, Text, View } from 'react-native';

import { ui } from '../../theme/colors';

export function HintList({ items }: { items: { label: string; met: boolean }[] }) {
  return (
    <View style={styles.hintList}>
      {items.map((item) => (
        <Text key={item.label} style={[styles.hintItem, item.met && styles.hintItemMet]}>
          {item.met ? '✓' : '○'} {item.label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hintList: { gap: 4 },
  hintItem: { color: ui.textSubtle, fontSize: 13 },
  hintItemMet: { color: ui.success },
});
