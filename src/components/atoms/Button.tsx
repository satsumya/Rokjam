import { Pressable, StyleSheet, Text } from 'react-native';

import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={(state) => [
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        disabled ? styles.buttonDisabled : interactionStyle(state),
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'secondary' && styles.buttonTextSecondary,
          variant === 'ghost' && styles.buttonTextGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: ui.primary,
    backgroundColor: ui.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonSecondary: { backgroundColor: ui.surface, borderColor: ui.primary },
  buttonGhost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: ui.primaryText, fontSize: 16, fontWeight: '600' },
  buttonTextSecondary: { color: ui.primary },
  buttonTextGhost: { color: ui.primary, textDecorationLine: 'underline' },
});
