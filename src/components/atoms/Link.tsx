import { Pressable, StyleSheet, Text } from 'react-native';

import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';

export function Link({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={interactionStyle}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { color: ui.primary, fontSize: 15, textDecorationLine: 'underline', textAlign: 'center' },
});
