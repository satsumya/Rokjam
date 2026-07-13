import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ui } from '../../theme/colors';
import { focusRing, useHoverFocus, type PreviewState } from '../../theme/interaction';

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
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
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
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: ui.textLabel },
  required: { color: ui.danger },
  input: {
    borderWidth: 1,
    borderColor: ui.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: ui.surface,
    color: ui.text,
  },
  inputHover: { borderColor: ui.borderStrong },
  inputError: { borderColor: ui.danger },
  hint: { color: ui.textMuted, fontSize: 13 },
  errorText: { color: ui.danger, fontSize: 13 },
});
