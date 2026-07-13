import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { ui } from '../../theme/colors';

export function Section({
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

const styles = StyleSheet.create({
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: ui.text },
});
