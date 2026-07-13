import { ScrollView, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { colors } from '../../theme/colors';

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
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.neutral[900] }}>{title}</Text>
        {description ? (
          <Text style={{ fontSize: 13, color: colors.neutral[600], lineHeight: 20, marginTop: 2 }}>
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
