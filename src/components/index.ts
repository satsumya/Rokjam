// Atomic design system barrel.
// atoms → basic building blocks · molecules → small compositions · organisms → feature sections.

// Atoms
export {
  Icon,
  ICON_NAMES,
  ICON_WEIGHTS,
  DEFAULT_WEIGHT_FOR_SIZE,
  type IconName,
  type IconWeight,
} from './atoms/Icon';
export { iconSizes, ICON_SIZE_NAMES, type IconSize } from '../theme/icon';
export { Text } from './atoms/Text';
export {
  headingSizes,
  bodySizes,
  fontFamilies,
  fontWeights,
  textVariants,
  textStyle,
  modularStep,
  FONT_BASE,
  FONT_RATIO,
  TEXT_VARIANT_NAMES,
  type TextVariant,
  type FontWeightName,
} from '../theme/typography';
export { Button, type ButtonSize, type ButtonVariant, type ButtonColorStyle } from './atoms/Button';
export {
  buttonGeometry,
  buttonStyleTokens,
  buttonColorStyleLabel,
  BUTTON_COLOR_STYLE_ORDER,
  type ButtonStyleTokens,
} from '../theme/buttonStyles';
export { space, SPACING_SCALE, type Space } from '../theme/spacing';
export { layout, pageGutter } from '../theme/layout';
export { colorPickerGeometry } from '../theme/colorPicker';
export { BRAND_COLOR_ORDER, brandColorLabel, type BrandColorId } from '../theme/colors';
export { DEFAULT_LEVEL_COLORS, levelPreset, PET_ROCK_AVATARS } from '../constants/difficultyLevels';
export { TextField } from './atoms/TextField';
export { Card } from './atoms/Card';
export { Link } from './atoms/Link';
export { Section } from './atoms/Section';
export { HintList } from './atoms/HintList';
export { Chip, RemovableChip } from './atoms/Chip';
export { ToggleChip } from './atoms/ToggleChip';
export { LevelDot } from './atoms/LevelDot';
export { DifficultyChip } from './atoms/DifficultyChip';
export { CheckboxRow } from './atoms/CheckboxRow';
export { RadioRow } from './atoms/RadioRow';
export { Avatar } from './atoms/Avatar';
export { Bar } from './atoms/Bar';
export { PrototypeOnly } from './atoms/PrototypeOnly';

// Molecules
export { Modal } from './molecules/Modal';
export { BottomSheet } from './molecules/BottomSheet';
export { Dropdown, type DropdownOption } from './molecules/Dropdown';
export { SessionTimeDropdown } from './molecules/SessionTimeDropdown';
export { DifficultyPicker } from './molecules/DifficultyPicker';
export { TagInput } from './molecules/TagInput';
export { LevelRow } from './molecules/LevelRow';
export { AddressSearch } from './molecules/AddressSearch';
export { ColorPicker } from './molecules/ColorPicker';
export { MiniBars } from './molecules/MiniBars';
export { ActivityHeatmap } from './molecules/ActivityHeatmap';
export { PieChart } from './molecules/PieChart';
export { SessionRow } from './molecules/SessionRow';
export { ShareMockBanner } from './molecules/ShareMockBanner';
export { ClimbCard } from './molecules/ClimbCard';
export { AccountMenu } from './molecules/AccountMenu';

// Organisms
export { Screen } from './organisms/Screen';
export { BottomNav, type BottomNavTab } from './organisms/BottomNav';
export { SessionBottomNav } from './organisms/SessionBottomNav';
export { ProfileSummaryCard } from './organisms/ProfileSummaryCard';
export { ClimbEditor } from './organisms/ClimbEditor';
export { SessionClimbsList } from './organisms/SessionClimbsList';
export { DashboardTrends } from './organisms/DashboardTrends';
export { CommunityTrends } from './organisms/CommunityTrends';
export { AddLocationSheet } from './organisms/AddLocationSheet';
export { SessionLocationPanel } from './organisms/SessionLocationPanel';
