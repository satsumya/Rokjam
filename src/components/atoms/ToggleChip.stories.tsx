import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ToggleChip } from './ToggleChip';
import { Padded, StatesGallery, previewStateArgType } from '../storybook.helpers';

const meta = {
  title: 'Atoms/ToggleChip',
  component: ToggleChip,
  decorators: [Padded],
  args: { label: 'overhang', selected: false, onPress: fn() },
  argTypes: { previewState: previewStateArgType },
} satisfies Meta<typeof ToggleChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Dense: Story = { args: { label: 'flash', paddingHorizontal: 8, fontSize: 13, selected: true } };

export const Interactive: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return <ToggleChip {...args} selected={on} onPress={() => setOn((v) => !v)} />;
  },
};

export const States: Story = {
  render: (args) => (
    <StatesGallery
      variants={[
        { id: 'unselected', label: 'unselected' },
        { id: 'selected', label: 'selected' },
      ]}
    >
      {(state, variantId) => (
        <ToggleChip {...args} selected={variantId === 'selected'} previewState={state} />
      )}
    </StatesGallery>
  ),
};
