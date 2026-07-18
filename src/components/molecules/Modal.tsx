import {
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import type { ReactNode } from 'react';

import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { pageGutter, layout } from '../../theme/layout';
import { space } from '../../theme/spacing';

export function Modal({
  visible,
  title,
  children,
  footer,
  onClose,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}) {
  const { width } = useWindowDimensions();
  const gutter = pageGutter(width);

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.modalRoot, { padding: gutter }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={onClose}
          style={styles.modalBackdrop}
        />
        <View style={styles.modalCard}>
          <View style={[styles.modalHeader, { paddingHorizontal: gutter }]}>
            <Text variant="h5" style={styles.modalTitle}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              style={(state) => [styles.modalClose, interactionStyle(state)]}
            >
              <Icon name="close" size="md" color={ui.textMuted} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={[styles.modalBodyContent, { padding: gutter }]}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {children}
          </ScrollView>
          {footer ? (
            <View style={[styles.modalFooter, { paddingHorizontal: gutter, paddingBottom: gutter }]}>
              {footer}
            </View>
          ) : null}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ui.overlay,
  },
  modalCard: {
    width: '100%',
    maxWidth: layout.modalMaxWidth,
    maxHeight: '90%',
    backgroundColor: ui.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ui.border,
    overflow: 'hidden',
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[16],
    borderBottomWidth: 1,
    borderBottomColor: ui.borderSubtle,
    gap: space[12],
  },
  modalTitle: { flex: 1, minWidth: 0 },
  modalClose: { padding: space[4], flexShrink: 0 },
  modalBody: { flexGrow: 0, flexShrink: 1 },
  modalBodyContent: { gap: space[12] },
  modalFooter: {
    paddingTop: 0,
    gap: space[12],
    borderTopWidth: 1,
    borderTopColor: ui.borderSubtle,
  },
});
