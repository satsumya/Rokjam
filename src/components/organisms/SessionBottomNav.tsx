import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '../atoms/Icon';
import { buttonGeometry, buttonStyleTokens } from '../../theme/buttonStyles';
import { colors } from '../../theme/colors';
import {
  focusRingInverse,
  interactionFlags,
  interactionStyle,
} from '../../theme/interaction';
import { space } from '../../theme/spacing';

const NAV_BG = colors.neutral[900];
const NAV_ICON = colors.neutral[300];
/** Session plus uses Style 1 (blue / green / purple) per active-session mock. */
const plusTokens = buttonStyleTokens('style1');

function NavBar({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function NavRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function NavSlot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function PlusShadow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function goBack() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/dashboard');
}

/**
 * Active-session chrome: back → prior screen, plus → add/save climb, checkFat → end session.
 * `check` vs `checkFat` is a usage choice (not size-mapped) — end session and save-climb use checkFat.
 */
export function SessionBottomNav({
  onPrimary,
  onEndSession,
  primaryMode = 'add',
}: {
  onPrimary: () => void;
  onEndSession: () => void;
  /** `add` shows plus; `save` shows checkFat while a climb is being edited. */
  primaryMode?: 'add' | 'save';
}) {
  const insets = useSafeAreaInsets();
  const primaryIcon: IconName = primaryMode === 'save' ? 'checkFat' : 'plus';
  const primaryLabel = primaryMode === 'save' ? 'Save climb' : 'Add climb';

  return (
    <NavBar style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space[12]) }]}>
      <NavRow style={styles.row}>
        <SideAction icon="arrowLineLeft" label="Back" onPress={goBack} />

        <NavSlot style={styles.plusSlot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={primaryLabel}
            onPress={onPrimary}
            style={(state) => [
              styles.plusHit,
              interactionStyle(state),
              interactionFlags(state).focused ? focusRingInverse : null,
            ]}
          >
            <PlusShadow
              style={[
                styles.plusShadow,
                {
                  backgroundColor: plusTokens.shadow,
                  top: buttonGeometry.shadowOffsetY,
                },
              ]}
            />
            <View
              style={[
                styles.plusFace,
                {
                  backgroundColor: plusTokens.fill,
                  borderColor: plusTokens.stroke,
                },
              ]}
            >
              <Icon name={primaryIcon} size="md" color={plusTokens.text} />
            </View>
          </Pressable>
        </NavSlot>

        <SideAction icon="checkFat" label="Save / end session" onPress={onEndSession} />
      </NavRow>
    </NavBar>
  );
}

function SideAction({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={(state) => [
        styles.tab,
        interactionStyle(state),
        interactionFlags(state).focused ? focusRingInverse : null,
      ]}
    >
      <Icon name={icon} size="md" color={NAV_ICON} weight="regular" />
    </Pressable>
  );
}

const PLUS_SIZE = 52;

const styles = StyleSheet.create({
  bar: {
    backgroundColor: NAV_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: space[16],
    paddingHorizontal: space[32],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[8],
    paddingHorizontal: space[12],
    borderRadius: 8,
  },
  plusSlot: {
    width: PLUS_SIZE + space[8],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -space[24],
  },
  plusHit: {
    width: PLUS_SIZE,
    height: PLUS_SIZE + buttonGeometry.shadowOffsetY,
    alignItems: 'center',
    borderRadius: PLUS_SIZE / 2,
  },
  plusShadow: {
    position: 'absolute',
    width: PLUS_SIZE,
    height: PLUS_SIZE,
    borderRadius: PLUS_SIZE / 2,
  },
  plusFace: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,
    borderRadius: PLUS_SIZE / 2,
    borderWidth: buttonGeometry.strokeWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
