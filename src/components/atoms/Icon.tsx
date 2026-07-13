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

/**
 * Named icon registry — the single source of truth for app iconography, backed
 * by Phosphor (https://phosphoricons.com). Reference icons by name so swapping
 * the underlying set or a single glyph only ever happens here.
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

export function Icon({
  name,
  size = 20,
  color = ui.text,
  weight = 'regular',
  ...rest
}: { name: IconName } & IconProps) {
  const Glyph = ICONS[name];
  return <Glyph size={size} color={color} weight={weight} {...rest} />;
}
