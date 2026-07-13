import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { Button } from './Button';
import { Padded, StatesGallery, previewStateArgType } from '../storybook.helpers';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  decorators: [Padded],
  args: { label: 'Save session', onPress: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    previewState: previewStateArgType,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Disabled: Story = { args: { disabled: true } };

export const States: Story = {
  render: (args) => (
    <StatesGallery>
      {(state) => <Button {...args} previewState={state} />}
    </StatesGallery>
  ),
};
