import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Modal as RNModal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';
import { layout, pageGutter } from '../../theme/layout';
import { space } from '../../theme/spacing';

const OPEN_MS = 280;
const CLOSE_MS = 220;

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
  const [rendered, setRendered] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const sheetHeight = useRef(320);
  const { width } = useWindowDimensions();
  const gutter = pageGutter(width);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      progress.setValue(0);
      const frame = requestAnimationFrame(() => {
        Animated.timing(progress, {
          toValue: 1,
          duration: OPEN_MS,
          useNativeDriver: true,
        }).start();
      });
      return () => cancelAnimationFrame(frame);
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: CLOSE_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setRendered(false);
    });
  }, [visible, progress]);

  if (!rendered) return null;

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const sheetTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetHeight.current, 0],
  });

  return (
    <RNModal visible={rendered} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root} pointerEvents="box-none">
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View
          onLayout={(event) => {
            sheetHeight.current = Math.max(event.nativeEvent.layout.height, 1);
          }}
          style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
        >
          <View style={[styles.sheetInner, { padding: gutter }]}>
            <Text variant="h5">{title}</Text>
            {children}
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ui.overlay,
  },
  sheet: {
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: ui.border,
    backgroundColor: ui.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
  },
  sheetInner: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    gap: space[12],
  },
});
