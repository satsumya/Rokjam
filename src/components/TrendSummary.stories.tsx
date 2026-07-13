import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import { CommunityTrends, DashboardTrends } from './TrendSummary';
import { createDemoSessions } from '../constants/mockSessions';
import type { TrendTimeframe } from '../types/climbingSession';
import { demoLocation, Padded } from './storybook.helpers';

const demoSessions = createDemoSessions(demoLocation.id, demoLocation.name);

const meta = {
  title: 'Components/TrendSummary',
  component: DashboardTrends,
  decorators: [Padded],
  args: { sessions: demoSessions, timeframe: 'week', onTimeframeChange: () => {} },
} satisfies Meta<typeof DashboardTrends>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  render: () => {
    const [timeframe, setTimeframe] = useState<TrendTimeframe>('week');
    return (
      <DashboardTrends
        sessions={demoSessions}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />
    );
  },
};

export const Community: Story = {
  render: () => <CommunityTrends sessions={demoSessions} />,
};
