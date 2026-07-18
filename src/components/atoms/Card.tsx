import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

/** Bordered surface used as a content card. */
function CardSurface({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <CardSurface style={[styles.box, style]}>{children}</CardSurface>;
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
