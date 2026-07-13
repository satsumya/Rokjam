import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { CheckboxRow } from './CheckboxRow';
import { Padded, StatesGallery, previewStateArgType } from '../storybook.helpers';

const meta = {
  title: 'Atoms/CheckboxRow',
  component: CheckboxRow,
  decorators: [Padded],
  args: { label: 'Hide warm-up climbs', checked: false, onPress: fn() },
  argTypes: { previewState: previewStateArgType },
} satisfies Meta<typeof CheckboxRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <CheckboxRow {...args} checked={checked} onPress={() => setChecked((v) => !v)} />;
  },
};

export const States: Story = {
  render: (args) => (
    <StatesGallery>
      {(state) => <CheckboxRow {...args} previewState={state} />}
    </StatesGallery>
  ),
};
