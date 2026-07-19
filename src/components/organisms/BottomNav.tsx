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

export type BottomNavTab = 'home' | 'sessions' | 'insights' | 'community';

const NAV_BG = colors.neutral[900];
const NAV_ICON = colors.neutral[300];
const NAV_ICON_ACTIVE = colors.neutral[50];
const playTokens = buttonStyleTokens('style2');

type NavItem = {
  tab: BottomNavTab;
  icon: IconName;
  label: string;
  href: string;
};

const SIDE_ITEMS: NavItem[] = [
  { tab: 'home', icon: 'house', label: 'Dashboard', href: '/dashboard' },
  { tab: 'sessions', icon: 'mountains', label: 'Climbing sessions', href: '/sessions' },
  { tab: 'insights', icon: 'shootingStar', label: 'Insights', href: '/insights' },
  { tab: 'community', icon: 'globeHemisphereEast', label: 'Community', href: '/community' },
];

function NavBar({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function NavRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function NavSlot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function PlayShadow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function go(href: string) {
  router.replace(href);
}

export function BottomNav({ active }: { active: BottomNavTab }) {
  const insets = useSafeAreaInsets();
  const left = SIDE_ITEMS.slice(0, 2);
  const right = SIDE_ITEMS.slice(2);

  return (
    <NavBar style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space[12]) }]}>
      <NavRow style={styles.row}>
        {left.map((item) => (
          <NavTab key={item.tab} item={item} active={active === item.tab} />
        ))}
        <NavSlot style={styles.playSlot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start climbing session"
            onPress={() => router.push('/sessions/create')}
            style={(state) => [
              styles.playHit,
              interactionStyle(state),
              interactionFlags(state).focused ? focusRingInverse : null,
            ]}
          >
            <PlayShadow
              style={[
                styles.playShadow,
                {
                  backgroundColor: playTokens.shadow,
                  top: buttonGeometry.shadowOffsetY,
                },
              ]}
            />
            <View
              style={[
                styles.playFace,
                {
                  backgroundColor: playTokens.fill,
                  borderColor: playTokens.stroke,
                },
              ]}
            >
              <Icon name="play" size="md" color={playTokens.text} weight="fill" />
            </View>
          </Pressable>
        </NavSlot>
        {right.map((item) => (
          <NavTab key={item.tab} item={item} active={active === item.tab} />
        ))}
      </NavRow>
    </NavBar>
  );
}

function NavTab({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active }}
      onPress={() => go(item.href)}
      style={(state) => [
        styles.tab,
        interactionStyle(state),
        interactionFlags(state).focused ? focusRingInverse : null,
      ]}
    >
      <Icon name={item.icon} size="md" color={active ? NAV_ICON_ACTIVE : NAV_ICON} weight="regular" />
      <View style={[styles.indicator, active ? styles.indicatorOn : null]} />
    </Pressable>
  );
}

const PLAY_SIZE = 52;

const styles = StyleSheet.create({
  bar: {
    backgroundColor: NAV_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: space[16],
    paddingHorizontal: space[12],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[6],
    paddingVertical: space[6],
    minWidth: 0,
    borderRadius: 8,
  },
  indicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicatorOn: {
    backgroundColor: NAV_ICON_ACTIVE,
  },
  playSlot: {
    width: PLAY_SIZE + space[12],
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -space[24],
  },
  playHit: {
    width: PLAY_SIZE,
    height: PLAY_SIZE + buttonGeometry.shadowOffsetY,
    alignItems: 'center',
    borderRadius: PLAY_SIZE / 2,
  },
  playShadow: {
    position: 'absolute',
    width: PLAY_SIZE,
    height: PLAY_SIZE,
    borderRadius: PLAY_SIZE / 2,
  },
  playFace: {
    width: PLAY_SIZE,
    height: PLAY_SIZE,
    borderRadius: PLAY_SIZE / 2,
    borderWidth: buttonGeometry.strokeWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
