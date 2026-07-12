import {
  KeyboardAvoidingView,
  Modal,
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

import { useFlowCapture } from '../hooks/useFlowCapture';
import { ui } from '../theme/colors';

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
  const flowCapture = useFlowCapture();

  const header = (
    <View style={styles.headerRow}>
      <Text style={styles.title}>{title}</Text>
      {headerRight}
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {flowCapture ? (
          <View style={[styles.flex, { justifyContent: 'space-between' }]}>
            <View style={styles.content}>
              {header}
              <View style={styles.body}>{children}</View>
            </View>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              {header}
              <View style={styles.body}>{children}</View>
            </ScrollView>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </>
        )}
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
        placeholderTextColor={ui.placeholder}
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
            <Text style={{ color: ui.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 }}>{subtitle}</Text>
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
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: ui.overlay }}
      />
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: ui.border,
          backgroundColor: ui.surface,
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

export function WireframeModal({
  visible,
  title,
  children,
  footer,
  onClose,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={onClose}
          style={styles.modalBackdrop}
        />
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {children}
          </ScrollView>
          {footer ? <View style={styles.modalFooter}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
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
  screen: { flex: 1, backgroundColor: ui.background },
  content: { padding: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  title: { flex: 1, fontSize: 28, fontWeight: '700', color: ui.text },
  body: { gap: 16 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: ui.borderSubtle,
    backgroundColor: ui.surfaceMuted,
    gap: 12,
  },
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
  inputError: { borderColor: ui.danger },
  hint: { color: ui.textMuted, fontSize: 13 },
  errorText: { color: ui.danger, fontSize: 13 },
  hintList: { gap: 4 },
  hintItem: { color: ui.textSubtle, fontSize: 13 },
  hintItemMet: { color: ui.success },
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
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: ui.primaryText, fontSize: 16, fontWeight: '600' },
  buttonTextSecondary: { color: ui.primary },
  buttonTextGhost: { color: ui.primary, textDecorationLine: 'underline' },
  box: {
    borderWidth: 1,
    borderColor: ui.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: ui.surfaceMuted,
    gap: 8,
  },
  link: { color: ui.primary, fontSize: 15, textDecorationLine: 'underline', textAlign: 'center' },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: ui.text },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ui.overlay,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: ui.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ui.border,
    overflow: 'hidden',
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: ui.borderSubtle,
    gap: 12,
  },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: ui.text },
  modalClose: { padding: 4 },
  modalCloseText: { fontSize: 28, lineHeight: 28, color: ui.textMuted },
  modalBody: { flexGrow: 0, flexShrink: 1 },
  modalBodyContent: { padding: 20, gap: 12 },
  modalFooter: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: ui.borderSubtle,
  },
});
