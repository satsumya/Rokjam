import { ScrollView, View } from 'react-native';
import type { ReactNode } from 'react';

import { Text } from '../../atoms/Text';
import { colors } from '../../../theme/colors';

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
    <View style={{ gap: 10 }}>
      <View>
        <Text variant="body" weight="bold" color={colors.neutral[900]}>
          {title}
        </Text>
        {description ? (
          <Text variant="bodySmall" color={colors.neutral[600]} style={{ marginTop: 2 }}>
            {description}
          </Text>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
        <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 4 }}>{children}</View>
      </ScrollView>
    </View>
  );
}
