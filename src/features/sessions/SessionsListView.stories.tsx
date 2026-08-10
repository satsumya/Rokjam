import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { SessionsListView } from './SessionsListView';

const meta = {
  title: 'Features/Sessions/SessionsListView',
  component: SessionsListView,
  args: {
    completed: [],
    activeSessions: [],
    onOpenSession: fn(),
    onContinueActiveSession: fn(),
  },
} satisfies Meta<typeof SessionsListView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSessions: Story = {
  args: {
    completed: [
      {
        session: {
          id: 's1',
          status: 'completed',
          date: '2026-07-03',
          startTime: '6:30 PM',
          endTime: '8:00 PM',
          locationId: 'loc-1',
          locationName: 'Urban Climb West End',
          climbs: [{ id: 'c1', tags: [], hasImage: false, hasVideo: false, isWarmUp: false, isRepeat: false, isProject: false, attempts: [] }],
          isPublic: false,
          ownerUsername: 'alex_climber',
          ownerAvatar: '🪨',
        },
        duration: '1h 30m',
        difficultyRange: 'Green–Blue',
      },
    ],
  },
};
