import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { DashboardTrends } from './DashboardTrends';
import type { TrendTimeframe } from '../../types/climbingSession';
import { demoSessions, Padded } from '../storybook.helpers';

const meta = {
  title: 'Organisms/DashboardTrends',
  component: DashboardTrends,
  decorators: [Padded],
  args: { sessions: demoSessions, timeframe: 'month', onTimeframeChange: fn() },
} satisfies Meta<typeof DashboardTrends>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [timeframe, setTimeframe] = useState<TrendTimeframe>('month');
    return <DashboardTrends {...args} timeframe={timeframe} onTimeframeChange={setTimeframe} />;
  },
};

export const Empty: Story = { args: { sessions: [] } };
