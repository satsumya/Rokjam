import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { Button, type ButtonColorStyle, type ButtonSize, type ButtonVariant } from './Button';
import { ICON_NAMES, type IconName } from './Icon';
import { Padded, StatesGallery, previewStateArgType } from '../storybook.helpers';
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
  { id: 'disabled', label: 'disabled' },
] as const;

const BUTTON_SIZES: { id: ButtonSize; label: string }[] = [
  { id: 'large', label: 'large · bodyLarge bold' },
  { id: 'small', label: 'small · bodySmall bold' },
];

const COLOR_STYLE_STATE_VARIANTS = BUTTON_COLOR_STYLE_ORDER.map((id) => ({
  id,
  label: buttonColorStyleLabel(id),
}));

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
    size: { control: 'select', options: ['large', 'small'] },
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

export const Style1: Story = {
  args: { label: 'Style 1', variant: 'primary', colorStyle: 'style1' },
};

export const Style2: Story = {
  args: { label: 'Style 2', variant: 'primary', colorStyle: 'style2' },
};

export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { variant: 'primary', colorStyle: 'style1', size: 'small' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };

export const WithIcons: Story = {
  args: {
    label: 'Continue',
    showIconLeft: true,
    showIconRight: true,
    iconLeft: 'check',
    iconRight: 'caretRight',
  },
};

export const IconOnly: Story = {
  args: {
    label: 'Save session',
    showIconOnly: true,
    icon: 'signOut',
    accessibilityLabel: 'Log out',
    variant: 'primary',
    colorStyle: 'style1',
  },
};

export const IconOnlySecondary: Story = {
  args: {
    label: 'Edit',
    showIconOnly: true,
    icon: 'pencil',
    accessibilityLabel: 'Edit',
    variant: 'secondary',
  },
};

export const YellowDifficulty: Story = {
  args: { label: 'Yellow difficulty', variant: 'primary', colorStyle: 'yellow' },
};

/** All colour styles × both sizes (mirrors the design comps). */
export const ColorStyles: Story = {
  render: (args) => (
    <View style={{ gap: space[24], alignItems: 'flex-start' }}>
      {BUTTON_COLOR_STYLE_ORDER.map((colorStyle) => (
        <View key={colorStyle} style={{ gap: space[8], alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: ui.text }}>
            {buttonColorStyleLabel(colorStyle)}
          </Text>
          {BUTTON_SIZES.map((size) => (
            <StoryButton
              key={size.id}
              {...args}
              variant="primary"
              label={buttonColorStyleLabel(colorStyle)}
              size={size.id}
              colorStyle={colorStyle}
              accessibilityLabel={buttonColorStyleLabel(colorStyle)}
            />
          ))}
        </View>
      ))}
    </View>
  ),
};

export const States: Story = {
  render: (args) => (
    <View style={{ gap: space[24], alignItems: 'flex-start' }}>
      {BUTTON_SIZES.map((size) => (
        <View key={size.id} style={{ gap: space[12], alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: ui.text }}>{size.label}</Text>
          <StatesGallery variants={BUTTON_STATE_VARIANTS}>
            {(state, variantId) => {
              if (variantId === 'secondary' || variantId === 'ghost') {
                return (
                  <StoryButton
                    {...args}
                    size={size.id}
                    variant={variantId as ButtonVariant}
                    disabled={false}
                    previewState={state}
                    accessibilityLabel={args.label ?? variantId}
                  />
                );
              }
              return (
                <StoryButton
                  {...args}
                  size={size.id}
                  variant="primary"
                  colorStyle={variantId === 'disabled' ? 'style1' : (variantId as ButtonColorStyle)}
                  disabled={variantId === 'disabled'}
                  previewState={state}
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

/** Interaction states for every colour style (large size). */
export const ColorStyleStates: Story = {
  args: { size: 'large' },
  render: (args) => (
    <StatesGallery variants={COLOR_STYLE_STATE_VARIANTS}>
      {(state, variantId) => (
        <StoryButton
          {...args}
          variant="primary"
          label={buttonColorStyleLabel(variantId as ButtonColorStyle)}
          colorStyle={variantId as ButtonColorStyle}
          previewState={state}
          accessibilityLabel={buttonColorStyleLabel(variantId as ButtonColorStyle)}
        />
      )}
    </StatesGallery>
  ),
};
