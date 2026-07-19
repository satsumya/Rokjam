import {
  ArrowDown,
  ArrowLineLeft,
  ArrowUp,
  Camera,
  CaretDown,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  CheckFat,
  CheckSquare,
  CircleIcon,
  DotsSixVertical,
  GlobeHemisphereEast,
  HouseLine,
  MapPin,
  Mountains,
  PencilSimple,
  Play,
  Plus,
  PresentationChart,
  RadioButton,
  ShootingStar,
  SignOut,
  Sparkle,
  Square,
  UserCircle,
  VideoCamera,
  X,
  type Icon as PhosphorIcon,
  type IconProps,
} from 'phosphor-react-native';

import { ui } from '../../theme/colors';
import { iconSizes, type IconSize } from '../../theme/icon';

/**
 * Named icon registry — the single source of truth for app iconography, backed
 * by Phosphor (https://phosphoricons.com). Reference icons by name so swapping
 * the underlying set or a single glyph only ever happens here.
 *
 * We import from the package barrel (clean prebuilt types); Metro can't resolve
 * that barrel under its strict package-exports resolver, so metro.config.js
 * bypasses package exports for phosphor-react-native.
 */
const ICONS = {
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowLineLeft: ArrowLineLeft,
  camera: Camera,
  caretUp: CaretUp,
  caretDown: CaretDown,
  caretRight: CaretRight,
  check: Check,
  checkCircle: CheckCircle,
  checkFat: CheckFat,
  checkboxChecked: CheckSquare,
  checkboxUnchecked: Square,
  circle: CircleIcon,
  close: X,
  dragHandle: DotsSixVertical,
  globeHemisphereEast: GlobeHemisphereEast,
  house: HouseLine,
  mapPin: MapPin,
  mountains: Mountains,
  pencil: PencilSimple,
  play: Play,
  plus: Plus,
  presentationChart: PresentationChart,
  radioSelected: RadioButton,
  radioUnselected: CircleIcon,
  shootingStar: ShootingStar,
  signOut: SignOut,
  sparkle: Sparkle,
  user: UserCircle,
  video: VideoCamera,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

// Give Phosphor glyphs readable DevTools names (they ship as anonymous factories).
for (const name of ICON_NAMES) {
  const Glyph = ICONS[name] as PhosphorIcon & { displayName?: string };
  Glyph.displayName = `Icon.${name}`;
}

/** Allowed Phosphor weights, in increasing visual heaviness. */
export const ICON_WEIGHTS = ['regular', 'bold', 'fill', 'duotone'] as const;

export type IconWeight = (typeof ICON_WEIGHTS)[number];

/**
 * Default weight per size token: small icons read better filled, larger ones
 * bold. Weight follows size automatically unless a `weight` is passed.
 */
export const DEFAULT_WEIGHT_FOR_SIZE: Record<IconSize, IconWeight> = {
  xs: 'fill',
  sm: 'fill',
  md: 'bold',
  lg: 'bold',
  xl: 'bold',
};

/**
 * `size` accepts an icon-size token (`xs`–`xl`, the preferred form) or a raw
 * pixel number as an escape hatch. Defaults to `sm` (20px). `weight` defaults to
 * the size's mapped weight (see DEFAULT_WEIGHT_FOR_SIZE); pass it to override.
 */
export function Icon({
  name,
  size = 'sm',
  color = ui.text,
  weight,
  ...rest
}: { name: IconName; size?: IconSize | number; weight?: IconWeight } & Omit<
  IconProps,
  'size' | 'weight'
>) {
  const Glyph = ICONS[name];
  if (!Glyph) {
    if (__DEV__) {
      console.warn(`Icon: unknown name "${String(name)}"`);
    }
    return null;
  }
  const px = typeof size === 'number' ? size : iconSizes[size];
  const resolvedWeight =
    weight ?? (typeof size === 'number' ? 'regular' : DEFAULT_WEIGHT_FOR_SIZE[size]);
  return <Glyph size={px} color={color} weight={resolvedWeight} {...rest} />;
}
