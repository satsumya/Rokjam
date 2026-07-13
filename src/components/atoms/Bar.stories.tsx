import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Bar } from './Bar';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/Bar',
  component: Bar,
  decorators: [Padded],
  args: { label: 'Mon', value: 45, max: 90, unit: 'm' },
} satisfies Meta<typeof Bar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Stack: Story = {
  render: () => (
    <View style={{ gap: 6 }}>
      <Bar label="Mon" value={30} max={90} unit="m" />
      <Bar label="Wed" value={60} max={90} unit="m" />
      <Bar label="Fri" value={90} max={90} unit="m" />
    </View>
  ),
};
