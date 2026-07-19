import type { Meta, StoryObj } from '@storybook/react-native';

import { ActivityHeatmap } from './ActivityHeatmap';
import { durationHeatmap } from '../../utils/sessionUtils';
import { demoSessions, Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/ActivityHeatmap',
  component: ActivityHeatmap,
  decorators: [Padded],
  args: {
    data: durationHeatmap(demoSessions, '3months', new Date('2026-07-18T12:00:00')),
  },
} satisfies Meta<typeof ActivityHeatmap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    data: durationHeatmap([], 'month', new Date('2026-07-18T12:00:00')),
  },
};
