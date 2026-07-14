import { ScrollView, View } from 'react-native';
import type { ReactNode } from 'react';

import { Text } from '../../atoms/Text';
import { colors } from '../../../theme/colors';
import { space } from '../../../theme/spacing';

/** Titled, horizontally scrolling row of colour swatches. */
export function PaletteRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View style={{ gap: space[12] }}>
      <View>
        <Text variant="body" weight="bold" color={colors.neutral[900]}>
          {title}
        </Text>
        {description ? (
          <Text variant="bodySmall" color={colors.neutral[600]} style={{ marginTop: space[4] }}>
            {description}
          </Text>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
        <View style={{ flexDirection: 'row', gap: space[12], paddingBottom: space[4] }}>{children}</View>
      </ScrollView>
    </View>
  );
}
