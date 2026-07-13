import { View } from 'react-native';
import type { ReactNode } from 'react';

import { Text } from './Text';
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
          <Text variant="h6">{title}</Text>
          {subtitle ? (
            <Text variant="bodySmall" color={ui.textMuted} style={{ marginTop: 4 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {headerAction}
      </View>
      {children}
    </View>
  );
}

const styles = {
  section: { gap: 10 },
} as const;
