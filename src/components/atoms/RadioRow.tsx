import { Pressable, View } from 'react-native';

import { Icon } from './Icon';
import { Text } from './Text';
import { ui } from '../../theme/colors';
import { interactionStyle, previewInteractionStyle, type PreviewState } from '../../theme/interaction';

/**
 * Inline radio row: a radio icon followed by its label. Use within a group where
 * exactly one option is selected; the parent owns the exclusive selection state.
 */
export function RadioRow({
  label,
  selected,
  onPress,
  previewState,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Preview/Storybook only: force a hover/press/focus visual state. */
  previewState?: PreviewState;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={(state) => [
        { borderRadius: 4 },
        interactionStyle(state),
        previewInteractionStyle(previewState),
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon
          name={selected ? 'radioSelected' : 'radioUnselected'}
          size="sm"
          color={selected ? ui.text : ui.textMuted}
          weight={selected ? 'fill' : 'regular'}
        />
        <Text variant="body">{label}</Text>
      </View>
    </Pressable>
  );
}
