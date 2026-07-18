import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { Button, type ButtonColorStyle, type ButtonSize, type ButtonVariant } from './Button';
import { ICON_NAMES, type IconName } from './Icon';
import { Padded, StatesGallery, GALLERY_STATES_WITH_DISABLED, previewStateArgType } from '../storybook.helpers';
import {
  BUTTON_COLOR_STYLE_ORDER,
  buttonColorStyleLabel,
} from '../../theme/buttonStyles';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

const BUTTON_STATE_VARIANTS = [
  { id: 'style1', label: 'style1 (default primary)' },
  { id: 'style2', label: 'style2' },
  { id: 'secondary', label: 'secondary' },
  { id: 'ghost', label: 'ghost' },
] as const;

const BUTTON_SIZES: { id: ButtonSize; label: string }[] = [
  { id: 'large', label: 'large · bodyLarge bold' },
  { id: 'medium', label: 'medium · body bold' },
  { id: 'small', label: 'small · bodySmall bold' },
];

/** Storybook controls — booleans toggle icons; selects pick glyphs (never `undefined`). */
type ButtonStoryArgs = React.ComponentProps<typeof Button> & {
  showIconLeft: boolean;
  showIconRight: boolean;
  showIconOnly: boolean;
};

function StoryButton({
  showIconLeft,
  showIconRight,
  showIconOnly,
  iconLeft,
  iconRight,
  icon,
  label,
  accessibilityLabel,
  ...rest
}: ButtonStoryArgs) {
  return (
    <Button
      {...rest}
      label={showIconOnly ? undefined : label}
      icon={showIconOnly ? icon : undefined}
      iconLeft={!showIconOnly && showIconLeft ? iconLeft : undefined}
      iconRight={!showIconOnly && showIconRight ? iconRight : undefined}
      accessibilityLabel={
        showIconOnly ? accessibilityLabel ?? label ?? 'Button' : accessibilityLabel
      }
    />
  );
}

const meta = {
  title: 'Atoms/Button',
  component: StoryButton,
  decorators: [Padded],
  args: {
    label: 'Save session',
    onPress: fn(),
    size: 'large' as ButtonSize,
    variant: 'primary' as ButtonVariant,
    colorStyle: 'style1' as ButtonColorStyle,
    showIconLeft: false,
    showIconRight: false,
    showIconOnly: false,
    iconLeft: 'check' as IconName,
    iconRight: 'caretRight' as IconName,
    icon: 'signOut' as IconName,
    accessibilityLabel: 'Log out',
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    colorStyle: {
      control: 'select',
      options: [...BUTTON_COLOR_STYLE_ORDER],
      description: 'Fill colours for primary buttons (style1, style2, difficulty)',
    },
    showIconLeft: {
      control: 'boolean',
      description: 'Toggle left icon on/off',
      table: { category: 'Icons' },
    },
    showIconRight: {
      control: 'boolean',
      description: 'Toggle right icon on/off',
      table: { category: 'Icons' },
    },
    showIconOnly: {
      control: 'boolean',
      description: 'Icon-only button (hides label; uses `icon`)',
      table: { category: 'Icons' },
    },
    iconLeft: {
      control: 'select',
      options: [...ICON_NAMES],
      description: 'Glyph when showIconLeft is on',
      table: { category: 'Icons' },
    },
    iconRight: {
      control: 'select',
      options: [...ICON_NAMES],
      description: 'Glyph when showIconRight is on',
      table: { category: 'Icons' },
    },
    icon: {
      control: 'select',
      options: [...ICON_NAMES],
      description: 'Glyph when showIconOnly is on',
      table: { category: 'Icons' },
    },
    previewState: previewStateArgType,
  },
} satisfies Meta<typeof StoryButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** All colour styles × all sizes. Empty label uses each style’s name; typing a label overrides all. */
export const ColorStyles: Story = {
  args: { label: '' },
  argTypes: {
    // Gallery shows every colour style — per-button colorStyle control is unused.
    colorStyle: { table: { disable: true } },
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
  },
  render: (args) => {
    const customLabel = args.label?.trim();
    return (
      <View style={{ gap: space[24], alignItems: 'flex-start' }}>
        {BUTTON_COLOR_STYLE_ORDER.map((colorStyle) => {
          const styleName = buttonColorStyleLabel(colorStyle);
          const buttonLabel = customLabel || styleName;
          return (
            <View key={colorStyle} style={{ gap: space[8], alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: ui.text }}>{styleName}</Text>
              {BUTTON_SIZES.map((size) => (
                <StoryButton
                  key={size.id}
                  {...args}
                  variant="primary"
                  label={buttonLabel}
                  size={size.id}
                  colorStyle={colorStyle}
                  accessibilityLabel={buttonLabel}
                />
              ))}
            </View>
          );
        })}
      </View>
    );
  },
};

export const States: Story = {
  argTypes: {
    // Gallery owns size / variant / colorStyle per cell.
    colorStyle: { table: { disable: true } },
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
  },
  render: (args) => (
    <View style={{ gap: space[24], alignItems: 'flex-start' }}>
      {BUTTON_SIZES.map((size) => (
        <View key={size.id} style={{ gap: space[12], alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: ui.text }}>{size.label}</Text>
          <StatesGallery variants={BUTTON_STATE_VARIANTS} states={GALLERY_STATES_WITH_DISABLED}>
            {(previewState, variantId, { disabled }) => {
              if (variantId === 'secondary' || variantId === 'ghost') {
                return (
                  <StoryButton
                    {...args}
                    size={size.id}
                    variant={variantId as ButtonVariant}
                    disabled={disabled}
                    previewState={disabled ? undefined : previewState}
                    accessibilityLabel={args.label ?? variantId}
                  />
                );
              }
              return (
                <StoryButton
                  {...args}
                  size={size.id}
                  variant="primary"
                  colorStyle={variantId as ButtonColorStyle}
                  disabled={disabled}
                  previewState={disabled ? undefined : previewState}
                  accessibilityLabel={args.label ?? variantId}
                />
              );
            }}
          </StatesGallery>
        </View>
      ))}
    </View>
  ),
};
