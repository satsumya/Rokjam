import { StyleSheet, TextInput, View } from 'react-native';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import { focusRing, useHoverFocus, type PreviewState } from '../../theme/interaction';
import { bodySizes, fontFamilies } from '../../theme/typography';

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  required,
  hint,
  keyboardType,
  maxLength,
  previewState,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  required?: boolean;
  hint?: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  maxLength?: number;
  /** Preview/Storybook only: force a hover/focus visual state. */
  previewState?: PreviewState;
}) {
  const { hovered, focused, bind } = useHoverFocus();
  const hoverActive = hovered || previewState === 'hover';
  const focusActive = focused || previewState === 'focused';

  return (
    <View style={styles.field}>
      <Text variant="body" weight="bold" style={styles.label}>
        {label}
        {required ? (
          <Text variant="body" weight="bold" color={ui.danger}>
            {' '}*
          </Text>
        ) : null}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor={ui.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        {...(bind as object)}
        style={[
          styles.input,
          hoverActive ? styles.inputHover : null,
          error ? styles.inputError : null,
          focusActive ? focusRing : null,
        ]}
      />
      {hint && !error ? (
        <Text variant="bodySmall" color={ui.textMuted}>
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Text variant="bodySmall" color={ui.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { color: ui.textLabel },
  input: {
    borderWidth: 1,
    borderColor: ui.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: fontFamilies.bodyRegular,
    fontSize: bodySizes.base,
    backgroundColor: ui.surface,
    color: ui.text,
  },
  inputHover: { borderColor: ui.borderStrong },
  inputError: { borderColor: ui.danger },
});
