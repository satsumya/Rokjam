import {
  ArrowDown,
  ArrowUp,
  Camera,
  CaretDown,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  CheckSquare,
  CircleIcon,
  DotsSixVertical,
  House,
  Sparkle,
  Square,
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
  camera: Camera,
  caretUp: CaretUp,
  caretDown: CaretDown,
  caretRight: CaretRight,
  check: Check,
  checkCircle: CheckCircle,
  checkboxChecked: CheckSquare,
  checkboxUnchecked: Square,
  circle: CircleIcon,
  close: X,
  dragHandle: DotsSixVertical,
  house: House,
  sparkle: Sparkle,
  video: VideoCamera,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/**
 * `size` accepts an icon-size token (`xs`–`xl`, the preferred form) or a raw
 * pixel number as an escape hatch. Defaults to `sm` (20px).
 */
export function Icon({
  name,
  size = 'sm',
  color = ui.text,
  weight = 'regular',
  ...rest
}: { name: IconName; size?: IconSize | number } & Omit<IconProps, 'size'>) {
  const Glyph = ICONS[name];
  const px = typeof size === 'number' ? size : iconSizes[size];
  return <Glyph size={px} color={color} weight={weight} {...rest} />;
}
