import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Bar } from './Bar';
import { Padded } from '../storybook.helpers';
import { formatDuration } from '../../utils/sessionUtils';
import { space } from '../../theme/spacing';

const meta = {
  title: 'Atoms/Bar',
  component: Bar,
  decorators: [Padded],
  args: { label: 'Mon', value: 150, max: 180, formatValue: formatDuration },
} satisfies Meta<typeof Bar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Stack: Story = {
  render: () => (
    <View style={{ gap: space[6] }}>
      <Bar label="Mon" value={30} max={150} formatValue={formatDuration} />
      <Bar label="Wed" value={60} max={150} formatValue={formatDuration} />
      <Bar label="Fri" value={150} max={150} formatValue={formatDuration} />
    </View>
  ),
};
