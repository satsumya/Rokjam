import { Pressable, StyleSheet, Text } from 'react-native';

import { ui } from '../../theme/colors';
import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';

export function Link({
  label,
  onPress,
  previewState,
}: {
  label: string;
  onPress: () => void;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [interactionStyle(state), previewInteractionStyle(previewState)]}
    >
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { color: ui.primary, fontSize: 15, textDecorationLine: 'underline', textAlign: 'center' },
});
