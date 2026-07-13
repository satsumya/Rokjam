import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { SessionTimeDropdown } from './SessionTimeDropdown';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/SessionTimeDropdown',
  component: SessionTimeDropdown,
  decorators: [Padded],
  args: { label: 'Start time', value: '5:30 PM', onChange: fn() },
} satisfies Meta<typeof SessionTimeDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('5:30 PM');
    return <SessionTimeDropdown {...args} value={value} onChange={setValue} />;
  },
};
