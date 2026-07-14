import { Pressable, View } from 'react-native';

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
        { borderRadius: 4 },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[6] }}>
        <Icon
          name={checked ? 'checkboxChecked' : 'checkboxUnchecked'}
          size="sm"
          color={checked ? ui.text : ui.textMuted}
          weight={checked ? 'fill' : 'regular'}
        />
        <Text variant="body">{label}</Text>
      </View>
    </Pressable>
  );
}
