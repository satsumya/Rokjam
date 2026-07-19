import type { Meta, StoryObj } from '@storybook/react-native';

import { PieChart } from './PieChart';
import { demoLevels, Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/PieChart',
  component: PieChart,
  decorators: [Padded],
  args: {
    slices: demoLevels.slice(0, 3).map((level, index) => ({
      label: level.name,
      value: 3 - index,
      color: level.color,
    })),
  },
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleSlice: Story = {
  args: {
    slices: [{ label: demoLevels[0].name, value: 4, color: demoLevels[0].color }],
  },
};

export const Empty: Story = {
  args: { slices: [] },
};
