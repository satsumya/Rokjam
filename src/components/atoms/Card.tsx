import { StyleSheet, View, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.box, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: ui.border,
    borderRadius: 8,
    padding: space[12],
    backgroundColor: ui.surfaceMuted,
    gap: space[8],
  },
});
