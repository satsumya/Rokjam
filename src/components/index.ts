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
export { IconLibraryDiagram } from './organisms/IconLibraryDiagram';
export { TypographyDiagram } from './organisms/TypographyDiagram';
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
export { Button } from './atoms/Button';
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
export { Swatch, ShadeSwatch, WcagAaCheck, type ContrastPreview } from './atoms/ColorSwatch';
export { FlowMapActionButton, type FlowMapActionVariant } from './atoms/FlowMapActionButton';
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
export { MiniBars } from './molecules/MiniBars';
export { SessionRow } from './molecules/SessionRow';
export { ShareMockBanner } from './molecules/ShareMockBanner';
export { ClimbCard } from './molecules/ClimbCard';
export { FlowMapVersionAccordion, type FlowMapVersionAccordionItem } from './molecules/FlowMapVersionAccordion';
export { PaletteRow } from './molecules/PaletteRow';

// Organisms
export { Screen } from './organisms/Screen';
export { ClimbEditor } from './organisms/ClimbEditor';
export { SessionClimbsList } from './organisms/SessionClimbsList';
export { DashboardTrends } from './organisms/DashboardTrends';
export { CommunityTrends } from './organisms/CommunityTrends';
export { ColorSystemDiagram, type ColorSystemFilter } from './organisms/ColorSystemDiagram';
export { AddLocationSheet } from './organisms/AddLocationSheet';
export { SessionLocationPanel } from './organisms/SessionLocationPanel';
export { FlowMapDiagram } from './organisms/FlowMapDiagram';
