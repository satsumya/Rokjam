import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { TextField } from './TextField';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/TextField',
  component: TextField,
  decorators: [Padded],
  args: { label: 'Email', value: '', onChangeText: fn() },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Email', required: true, placeholder: 'you@example.com' },
};

export const WithHint: Story = {
  args: { label: 'Username', hint: 'Shown on your public sessions' },
};

export const WithError: Story = {
  args: { label: 'Email', value: 'not-an-email', error: 'Enter a valid email' },
};

export const Interactive: Story = {
  args: { label: 'Username' },
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextField {...args} value={value} onChangeText={setValue} />;
  },
};
