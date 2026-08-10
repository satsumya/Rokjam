import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { CommunityView } from './CommunityView';

const meta = {
  title: 'Features/Community/CommunityView',
  component: CommunityView,
  args: {
    tab: 'all',
    feed: [],
    allPublicSessions: [],
    followedUsers: ['alex_climber'],
    onTabChange: fn(),
    onToggleFollow: fn(),
  },
} satisfies Meta<typeof CommunityView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithFeed: Story = {
  args: {
    feed: [
      {
        session: {
          id: 'pub-1',
          status: 'completed',
          date: '2026-07-03',
          startTime: '6:30 PM',
          endTime: '8:00 PM',
          locationId: 'loc-1',
          locationName: 'Urban Climb West End',
          climbs: [
            {
              id: 'c1',
              levelName: 'Blue',
              name: 'Slab project',
              tags: [],
              hasImage: false,
              hasVideo: false,
              isWarmUp: false,
              isRepeat: false,
              isProject: true,
              attempts: [{ id: 'a1', progress: ['start', 'middle'] }],
            },
          ],
          isPublic: true,
          ownerUsername: 'crimp_queen',
          ownerAvatar: '🦎',
        },
        duration: '1h 30m',
        difficultyRange: 'Blue',
      },
    ],
    allPublicSessions: [],
  },
};
