import type { Meta, StoryObj } from '@storybook/react-native';

import { MiniBars } from './MiniBars';
import { Padded } from '../storybook.helpers';
import { formatDuration } from '../../utils/sessionUtils';

const meta = {
  title: 'Molecules/MiniBars',
  component: MiniBars,
  decorators: [Padded],
  args: {
    formatValue: formatDuration,
    data: [
      { label: 'Mon', value: 45 },
      { label: 'Wed', value: 75 },
      { label: 'Fri', value: 60 },
      { label: 'Sun', value: 150 },
    ],
  },
} satisfies Meta<typeof MiniBars>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { data: [] } };
