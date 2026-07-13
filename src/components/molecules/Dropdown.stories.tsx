import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Dropdown, type DropdownOption } from './Dropdown';
import { Padded } from '../storybook.helpers';

const OPTIONS: DropdownOption[] = [
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
];

const meta = {
  title: 'Molecules/Dropdown',
  component: Dropdown,
  decorators: [Padded],
  args: { label: 'Duration', value: '60', options: OPTIONS, onChange: fn() },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('60');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
};

export const WithCustomValue: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [custom, setCustom] = useState('');
    return (
      <Dropdown
        {...args}
        value={value}
        onChange={setValue}
        customValue={custom}
        onCustomChange={setCustom}
        customPlaceholder="Minutes"
      />
    );
  },
};
