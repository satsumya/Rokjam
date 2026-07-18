import { View } from 'react-native';
import type { ReactNode } from 'react';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export function Section({
  title,
  subtitle,
  headerAction,
  required,
  children,
}: {
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  /** Show a required asterisk on the section title (e.g. when the field label is omitted). */
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: space[12],
          marginBottom: subtitle || headerAction ? 4 : 0,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="h5">
            {title}
            {required ? (
              <Text variant="h5" color={ui.danger}>
                {' '}*
              </Text>
            ) : null}
          </Text>
          {subtitle ? (
            <Text variant="bodySmall" color={ui.textMuted} style={{ marginTop: space[4] }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {headerAction ? <View style={{ flexShrink: 0, maxWidth: '100%' }}>{headerAction}</View> : null}
      </View>
      {children}
    </View>
  );
}

const styles = {
  section: { gap: space[12] },
} as const;
