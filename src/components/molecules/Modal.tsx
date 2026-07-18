import {
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';
import type { ComponentProps, ReactNode } from 'react';

import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';
import { pageGutter, layout } from '../../theme/layout';
import { space } from '../../theme/spacing';

function ModalRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ModalCard({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ModalHeader({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ModalBody(props: ComponentProps<typeof ScrollView>) {
  return <ScrollView {...props} />;
}

function ModalFooter({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

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
      <ModalRoot style={[styles.modalRoot, { padding: gutter }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          onPress={onClose}
          style={styles.modalBackdrop}
        />
        <ModalCard style={styles.modalCard}>
          <ModalHeader style={[styles.modalHeader, { paddingHorizontal: gutter }]}>
            <Text variant="h5" style={styles.modalTitle}>
              {title}
            </Text>
            <Button
              icon="close"
              variant="ghost"
              size="small"
              accessibilityLabel="Close"
              onPress={onClose}
            />
          </ModalHeader>
          <ModalBody
            style={styles.modalBody}
            contentContainerStyle={[styles.modalBodyContent, { padding: gutter }]}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {children}
          </ModalBody>
          {footer ? (
            <ModalFooter style={[styles.modalFooter, { paddingHorizontal: gutter, paddingBottom: gutter }]}>
              {footer}
            </ModalFooter>
          ) : null}
        </ModalCard>
      </ModalRoot>
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
  modalBody: { flexGrow: 0, flexShrink: 1 },
  modalBodyContent: { gap: space[12] },
  modalFooter: {
    paddingTop: 0,
    gap: space[12],
    borderTopWidth: 1,
    borderTopColor: ui.borderSubtle,
  },
});
