import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ComponentProps, ReactNode } from 'react';

import { Text } from '../atoms/Text';
import { useFlowCapture } from '../../hooks/useFlowCapture';
import { ui } from '../../theme/colors';
import { layout, pageGutter } from '../../theme/layout';
import { space } from '../../theme/spacing';

/** Safe-area root for every screen. */
function ScreenSafeArea({ style, ...rest }: ComponentProps<typeof SafeAreaView>) {
  return <SafeAreaView style={style} {...rest} />;
}

/** Keyboard avoidance shell around scroll + footer. */
function ScreenKeyboard({ style, ...rest }: ComponentProps<typeof KeyboardAvoidingView>) {
  return <KeyboardAvoidingView style={style} {...rest} />;
}

/** Main scrollable column (disabled during flow-map capture). */
function ScreenScroll(props: ComponentProps<typeof ScrollView>) {
  return <ScrollView {...props} />;
}

/** Capture-mode column that freezes layout instead of scrolling. */
function ScreenCaptureColumn({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Title row + optional header actions. */
function ScreenHeader({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Slot for header-right actions (e.g. logout, close). */
function ScreenHeaderActions({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Padded content column that holds header + body. */
function ScreenContent({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Main screen body stack (children). */
function ScreenBody({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Sticky footer chrome (border + muted surface). */
function ScreenFooter({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Padded footer actions column. */
function ScreenFooterActions({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Bottom tab chrome (no muted surface — nav paints itself). */
function ScreenBottomNav({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

export function Screen({
  title,
  children,
  footer,
  bottomNav,
  headerRight,
  overlay,
  wide = false,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Primary tab bar — replaces sticky footer chrome on main destinations. */
  bottomNav?: ReactNode;
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
  const showHeader = Boolean(title) || Boolean(headerRight);

  const header = showHeader ? (
    <ScreenHeader style={styles.headerRow}>
      {title ? (
        <Text variant="h4" style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.title} />
      )}
      {headerRight ? <ScreenHeaderActions style={styles.headerRight}>{headerRight}</ScreenHeaderActions> : null}
    </ScreenHeader>
  ) : null;

  const chrome = bottomNav ? (
    <ScreenBottomNav style={[styles.bottomNav, columnStyle]}>{bottomNav}</ScreenBottomNav>
  ) : footer ? (
    <ScreenFooter style={[styles.footer, columnStyle]}>
      <ScreenFooterActions style={footerPadded}>{footer}</ScreenFooterActions>
    </ScreenFooter>
  ) : null;

  return (
    <ScreenSafeArea style={styles.screen} edges={bottomNav ? ['top', 'left', 'right'] : undefined}>
      <ScreenKeyboard
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {flowCapture ? (
          <ScreenCaptureColumn style={[styles.flex, { justifyContent: 'space-between' }]}>
            <ScreenContent style={[styles.content, padded, columnStyle]}>
              {header}
              <ScreenBody style={styles.body}>{children}</ScreenBody>
            </ScreenContent>
            {chrome}
          </ScreenCaptureColumn>
        ) : (
          <>
            <ScreenScroll
              contentContainerStyle={[styles.content, padded, columnStyle]}
              keyboardShouldPersistTaps="handled"
            >
              {header}
              <ScreenBody style={styles.body}>{children}</ScreenBody>
            </ScreenScroll>
            {chrome}
          </>
        )}
      </ScreenKeyboard>
      {overlay}
    </ScreenSafeArea>
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
    width: '100%',
    alignSelf: 'center',
    borderTopWidth: 1,
    borderTopColor: ui.borderSubtle,
    backgroundColor: ui.surfaceMuted,
  },
  bottomNav: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
});
