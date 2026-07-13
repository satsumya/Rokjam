import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import { SessionTimeDropdown } from './SessionTimeDropdown';
import { Padded } from './storybook.helpers';

const meta = {
  title: 'Components/SessionTimeDropdown',
  component: SessionTimeDropdown,
  decorators: [Padded],
  args: { label: 'Session duration', value: '60', onChange: () => {} },
} satisfies Meta<typeof SessionTimeDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Duration: Story = {
  render: () => {
    const [value, setValue] = useState('60');
    return <SessionTimeDropdown label="Session duration" value={value} onChange={setValue} />;
  },
};
