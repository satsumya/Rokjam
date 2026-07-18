import { Pressable, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { Text } from './Text';
import { ui } from '../../theme/colors';
import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';
import { space } from '../../theme/spacing';

/** Inline checkbox row: a checkbox icon followed by its label. */
export function CheckboxRow({
  label,
  checked,
  onPress,
  previewState,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        styles.row,
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <Icon
        name={checked ? 'checkboxChecked' : 'checkboxUnchecked'}
        size="sm"
        color={checked ? ui.text : ui.textMuted}
        weight={checked ? 'fill' : 'regular'}
      />
      <Text variant="body">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[6],
    borderRadius: 4,
  },
});
