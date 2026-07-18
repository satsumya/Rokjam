import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { Text } from '../atoms/Text';
import { useFlowCapture } from '../../hooks/useFlowCapture';
import { ui } from '../../theme/colors';
import { layout, pageGutter } from '../../theme/layout';
import { space } from '../../theme/spacing';

export function Screen({
  title,
  children,
  footer,
  headerRight,
  overlay,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  headerRight?: ReactNode;
  overlay?: ReactNode;
  /**
   * Full-bleed content (no max width). Use for utility pages — scenarios,
   * flow map, colour system, typography, icon library.
   */
  wide?: boolean;
}) {
  const flowCapture = useFlowCapture();
  const { width } = useWindowDimensions();
  const gutter = pageGutter(width);
  const columnStyle = wide ? undefined : styles.column;
  const padded = { padding: gutter, paddingBottom: space[32] };
  const footerPadded = { padding: gutter, gap: space[12] };

  const header = (
    <View style={styles.headerRow}>
      <Text variant="h4" style={styles.title}>
        {title}
      </Text>
      {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
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
            <View style={[styles.content, padded, columnStyle]}>
              {header}
              <View style={styles.body}>{children}</View>
            </View>
            {footer ? (
              <View style={styles.footer}>
                <View style={[footerPadded, columnStyle]}>{footer}</View>
              </View>
            ) : null}
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={[styles.content, padded, columnStyle]}
              keyboardShouldPersistTaps="handled"
            >
              {header}
              <View style={styles.body}>{children}</View>
            </ScrollView>
            {footer ? (
              <View style={styles.footer}>
                <View style={[footerPadded, columnStyle]}>{footer}</View>
              </View>
            ) : null}
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
  column: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
  },
  content: { width: '100%' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: space[24],
    gap: space[12],
  },
  title: { flex: 1, minWidth: 0 },
  headerRight: { flexShrink: 0 },
  body: { gap: space[16] },
  footer: {
    borderTopWidth: 1,
    borderTopColor: ui.borderSubtle,
    backgroundColor: ui.surfaceMuted,
  },
});
