import { StyleSheet, TextInput, View } from 'react-native';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import { focusRing, useHoverFocus, type PreviewState } from '../../theme/interaction';
import { bodySizes, fontFamilies } from '../../theme/typography';
import { space } from '../../theme/spacing';

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  success,
  required,
  hint,
  keyboardType,
  maxLength,
  previewState,
  accessibilityLabel,
  onSubmitEditing,
  returnKeyType,
  onBlur,
  onFocus,
}: {
  /** Omit when a parent Section/Modal title already names this field. */
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  /** Positive validation message (e.g. username available). Hidden when `error` is set. */
  success?: string;
  required?: boolean;
  hint?: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  maxLength?: number;
  /** Preview/Storybook only: force a hover/focus visual state. */
  previewState?: PreviewState;
  accessibilityLabel?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onBlur?: () => void;
  onFocus?: () => void;
}) {
  const { hovered, focused, bind } = useHoverFocus();
  const hoverActive = hovered || previewState === 'hover';
  const focusActive = focused || previewState === 'focused';

  return (
    <View style={styles.field}>
      {label ? (
        <Text variant="body" weight="bold" style={styles.label}>
          {label}
          {required ? (
            <Text variant="body" weight="bold" color={ui.danger}>
              {' '}*
            </Text>
          ) : null}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor={ui.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        blurOnSubmit={Boolean(onSubmitEditing)}
        {...(bind as object)}
        onFocus={() => {
          bind.onFocus();
          onFocus?.();
        }}
        onBlur={() => {
          bind.onBlur();
          onBlur?.();
        }}
        style={[
          styles.input,
          hoverActive ? styles.inputHover : null,
          error ? styles.inputError : null,
          focusActive ? focusRing : null,
        ]}
      />
      {error ? (
        <Text variant="bodySmall" color={ui.danger}>
          {error}
        </Text>
      ) : success ? (
        <Text variant="bodySmall" color={ui.success}>
          {success}
        </Text>
      ) : hint ? (
        <Text variant="bodySmall" color={ui.textMuted}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space[6], width: '100%' },
  label: { color: ui.textLabel },
  input: {
    borderWidth: 1,
    borderColor: ui.border,
    borderRadius: 8,
    paddingHorizontal: space[12],
    paddingVertical: space[12],
    fontFamily: fontFamilies.bodyRegular,
    fontSize: bodySizes.base,
    backgroundColor: ui.surface,
    color: ui.text,
    width: '100%',
  },
  inputHover: { borderColor: ui.borderStrong },
  inputError: { borderColor: ui.danger },
});
