import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

export function WireframeScreen({
  title,
  children,
  footer,
  headerRight,
  overlay,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  headerRight?: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            {headerRight}
          </View>
          <View style={styles.body}>{children}</View>
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
      {overlay}
    </SafeAreaView>
  );
}

export function WireframeField({
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
}) {
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
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function WireframeButton({
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
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
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

export function WireframeBox({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.box, style]}>{children}</View>;
}

export function WireframeLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

export function WireframeSection({
  title,
  subtitle,
  headerAction,
  children,
}: {
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: subtitle || headerAction ? 4 : 0,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? (
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4, lineHeight: 18 }}>{subtitle}</Text>
          ) : null}
        </View>
        {headerAction}
      </View>
      {children}
    </View>
  );
}

export function WireframeBottomSheet({
  visible,
  title,
  children,
  onClose,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        zIndex: 100,
      }}
    >
      <Pressable
        onPress={onClose}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' }}
      />
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#CCC',
          backgroundColor: '#FFF',
          padding: 20,
          gap: 12,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

export function WireframeHintList({
  items,
}: {
  items: { label: string; met: boolean }[];
}) {
  return (
    <View style={styles.hintList}>
      {items.map((item) => (
        <Text key={item.label} style={[styles.hintItem, item.met && styles.hintItemMet]}>
          {item.met ? '✓' : '○'} {item.label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  title: { flex: 1, fontSize: 28, fontWeight: '700', color: '#111' },
  body: { gap: 16 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FAFAFA',
    gap: 12,
  },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  required: { color: '#C0392B' },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#111',
  },
  inputError: { borderColor: '#C0392B' },
  hint: { color: '#666', fontSize: 13 },
  errorText: { color: '#C0392B', fontSize: 13 },
  hintList: { gap: 4 },
  hintItem: { color: '#888', fontSize: 13 },
  hintItemMet: { color: '#2E7D32' },
  button: {
    borderWidth: 1,
    borderColor: '#111',
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonSecondary: { backgroundColor: '#FFF', borderColor: '#111' },
  buttonGhost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  buttonTextSecondary: { color: '#111' },
  buttonTextGhost: { color: '#111', textDecorationLine: 'underline' },
  box: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  link: { color: '#111', fontSize: 15, textDecorationLine: 'underline', textAlign: 'center' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#222' },
});
