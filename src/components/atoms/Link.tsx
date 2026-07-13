import { Pressable, StyleSheet } from 'react-native';

import { Text } from './Text';
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
      <Text variant="body" color={ui.primary} style={styles.link}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { textDecorationLine: 'underline', textAlign: 'center' },
});
