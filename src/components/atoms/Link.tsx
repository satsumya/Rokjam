import { Pressable, StyleSheet, Text } from 'react-native';

import { ui } from '../../theme/colors';

export function Link({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { color: ui.primary, fontSize: 15, textDecorationLine: 'underline', textAlign: 'center' },
});
