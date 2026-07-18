import { View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';

import { Text } from './Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

function SectionRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SectionHeader({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SectionTitleBlock({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SectionHeaderAction({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Required-field asterisk nested inside a title (RN coloured substring). */
function RequiredAsterisk({ variant }: { variant: 'h5' | 'body' }) {
  return (
    <Text variant={variant} weight={variant === 'body' ? 'bold' : undefined} color={ui.danger}>
      {' '}
      *
    </Text>
  );
}

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
    <SectionRoot style={styles.section}>
      <SectionHeader
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: space[12],
          marginBottom: subtitle || headerAction ? 4 : 0,
        }}
      >
        <SectionTitleBlock style={{ flex: 1, minWidth: 0 }}>
          <Text variant="h5">
            {title}
            {required ? <RequiredAsterisk variant="h5" /> : null}
          </Text>
          {subtitle ? (
            <Text variant="bodySmall" color={ui.textMuted} style={{ marginTop: space[4] }}>
              {subtitle}
            </Text>
          ) : null}
        </SectionTitleBlock>
        {headerAction ? (
          <SectionHeaderAction style={{ flexShrink: 0, maxWidth: '100%' }}>{headerAction}</SectionHeaderAction>
        ) : null}
      </SectionHeader>
      {children}
    </SectionRoot>
  );
}

const styles = {
  section: { gap: space[12] },
} as const;
