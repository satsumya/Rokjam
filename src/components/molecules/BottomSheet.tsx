import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';

import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export function BottomSheet({
  visible,
  title,
  children,
  onClose,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        zIndex: 100,
      }}
    >
      <Pressable
        onPress={onClose}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: ui.overlay }}
      />
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: ui.border,
          backgroundColor: ui.surface,
          padding: space[24],
          gap: space[12],
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Text variant="h5">{title}</Text>
        {children}
      </View>
    </View>
  );
}
