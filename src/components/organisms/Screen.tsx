import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { useFlowCapture } from '../../hooks/useFlowCapture';
import { ui } from '../../theme/colors';

export function Screen({
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
});
