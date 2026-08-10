import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { InsightsView } from './InsightsView';

const meta = {
  title: 'Features/Dashboard/InsightsView',
  component: InsightsView,
  args: {
    needsProfile: true,
    sessions: [],
    locations: [],
    timeframe: 'month',
    onTimeframeChange: fn(),
  },
} satisfies Meta<typeof InsightsView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeedsProfile: Story = {};

export const WithTrends: Story = {
  args: {
    needsProfile: false,
    locations: [
      {
        id: 'loc-1',
        name: 'Urban Climb West End',
        isHome: true,
        levelSort: 'easy-hard',
        levels: [
          { id: 'l1', name: 'Green', color: '#22c55e' },
          { id: 'l2', name: 'Blue', color: '#3b82f6' },
        ],
      },
    ],
    sessions: [
      {
        id: 's1',
        status: 'completed',
        date: '2026-07-03',
        startTime: '6:30 PM',
        endTime: '8:00 PM',
        locationId: 'loc-1',
        locationName: 'Urban Climb West End',
        climbs: [],
        isPublic: false,
        ownerUsername: 'alex_climber',
        ownerAvatar: '🪨',
      },
    ],
  },
};
