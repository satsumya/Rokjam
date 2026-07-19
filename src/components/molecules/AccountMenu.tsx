import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';
import { router } from 'expo-router';

import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { colors, ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { space } from '../../theme/spacing';

const MENU_WIDTH = 168;
/** Peach fill + pink stroke — linked trigger + menu surface. */
const FILL = colors.brand.orange.light;
const STROKE = colors.brand.pink.main;
const DIVIDER = colors.brand.purple.light;

function MenuShell({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function MenuCap({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function MenuBody({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

type Anchor = { x: number; y: number; width: number; height: number };

export function AccountMenu({ onSignOut }: { onSignOut: () => void }) {
  const triggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const close = () => {
    setOpen(false);
    setAnchor(null);
  };

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  const right = anchor ? Math.max(space[16], windowWidth - anchor.x - anchor.width) : space[16];
  const top = anchor?.y ?? space[48];

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Account menu"
          accessibilityState={{ expanded: open }}
          onPress={openMenu}
          style={(state) => [
            styles.closedTrigger,
            open ? styles.closedTriggerHidden : null,
            interactionStyle(state),
          ]}
        >
          <Icon name="user" size="md" color={ui.text} weight="regular" />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Dismiss menu">
          <MenuShell
            style={[styles.shell, { top, right }]}
            // Absorb presses so the backdrop dismiss does not fire for menu taps.
            onStartShouldSetResponder={() => true}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close account menu"
              onPress={close}
              style={(state) => [styles.cap, interactionStyle(state)]}
            >
              <MenuCap style={styles.capInner}>
                <Icon name="caretDown" size="xs" color={ui.text} />
                <Icon name="user" size="md" color={ui.text} weight="regular" />
              </MenuCap>
            </Pressable>

            <MenuBody style={styles.body}>
              <Pressable
                accessibilityRole="menuitem"
                accessibilityLabel="Edit profile"
                onPress={() => {
                  close();
                  router.push('/profile/setup');
                }}
                style={(state) => [styles.item, interactionStyle(state)]}
              >
                <Text variant="body" weight="bold">
                  Edit profile
                </Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                accessibilityRole="menuitem"
                accessibilityLabel="Log out"
                onPress={() => {
                  close();
                  onSignOut();
                }}
                style={(state) => [styles.item, interactionStyle(state)]}
              >
                <Text variant="body" weight="bold">
                  Log out
                </Text>
              </Pressable>
            </MenuBody>
          </MenuShell>
        </Pressable>
      </Modal>
    </>
  );
}

const softShadow = {
  shadowColor: ui.shadow,
  shadowOpacity: 0.12,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
} as const;

const styles = StyleSheet.create({
  closedTrigger: {
    padding: space[4],
    borderRadius: 20,
  },
  closedTriggerHidden: {
    opacity: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  shell: {
    position: 'absolute',
    width: MENU_WIDTH,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  cap: {
    zIndex: 1,
    marginBottom: -1,
    backgroundColor: FILL,
    borderWidth: 1,
    borderColor: STROKE,
    borderRadius: 12,
    paddingHorizontal: space[8],
    paddingVertical: space[6],
    ...softShadow,
  },
  capInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  body: {
    width: '100%',
    backgroundColor: FILL,
    borderWidth: 1,
    borderColor: STROKE,
    borderRadius: 12,
    overflow: 'hidden',
    ...softShadow,
  },
  item: {
    paddingHorizontal: space[16],
    paddingVertical: space[12],
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
  },
});
