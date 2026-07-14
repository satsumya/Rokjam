import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { Button, type ButtonColorStyle, type ButtonSize, type ButtonVariant } from './Button';
import { Padded, StatesGallery, previewStateArgType } from '../storybook.helpers';
import {
  BUTTON_COLOR_STYLE_ORDER,
  buttonColorStyleLabel,
} from '../../theme/buttonStyles';
import { ui } from '../../theme/colors';

const BUTTON_STATE_VARIANTS = [
  { id: 'primary', label: 'primary' },
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

const meta = {
  title: 'Atoms/Button',
  component: Button,
  decorators: [Padded],
  args: { label: 'Save session', onPress: fn(), size: 'large' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['large', 'small'] },
    colorStyle: {
      control: 'select',
      options: [undefined, ...BUTTON_COLOR_STYLE_ORDER],
    },
    previewState: previewStateArgType,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { variant: 'primary', size: 'small' } };
export const Disabled: Story = { args: { disabled: true } };

export const Style1: Story = {
  args: { label: 'Style 1', colorStyle: 'style1' },
};

export const Style2: Story = {
  args: { label: 'Style 2', colorStyle: 'style2' },
};

export const YellowDifficulty: Story = {
  args: { label: 'Yellow difficulty', colorStyle: 'yellow' },
};

/** All colour styles × both sizes (mirrors the design comps). */
export const ColorStyles: Story = {
  render: (args) => (
    <View style={{ gap: 20, alignItems: 'flex-start' }}>
      {BUTTON_COLOR_STYLE_ORDER.map((colorStyle) => (
        <View key={colorStyle} style={{ gap: 8, alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: ui.text }}>
            {buttonColorStyleLabel(colorStyle)}
          </Text>
          {BUTTON_SIZES.map((size) => (
            <Button
              key={size.id}
              {...args}
              label={buttonColorStyleLabel(colorStyle)}
              size={size.id}
              colorStyle={colorStyle}
            />
          ))}
        </View>
      ))}
    </View>
  ),
};

export const States: Story = {
  render: (args) => (
    <View style={{ gap: 28, alignItems: 'flex-start' }}>
      {BUTTON_SIZES.map((size) => (
        <View key={size.id} style={{ gap: 12, alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: ui.text }}>{size.label}</Text>
          <StatesGallery variants={BUTTON_STATE_VARIANTS}>
            {(state, variantId) => (
              <Button
                {...args}
                colorStyle={undefined}
                size={size.id}
                variant={variantId === 'disabled' ? 'primary' : (variantId as ButtonVariant)}
                disabled={variantId === 'disabled'}
                previewState={state}
              />
            )}
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
        <Button
          {...args}
          label={buttonColorStyleLabel(variantId as ButtonColorStyle)}
          colorStyle={variantId as ButtonColorStyle}
          previewState={state}
        />
      )}
    </StatesGallery>
  ),
};
