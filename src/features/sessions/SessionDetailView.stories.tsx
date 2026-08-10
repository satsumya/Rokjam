import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import type { ClimbingSession } from '../../types/climbingSession';

import { SessionDetailView } from './SessionDetailView';

const completedSession: ClimbingSession = {
  id: 's1',
  status: 'completed' as const,
  date: '2026-07-03',
  startTime: '6:30 PM',
  endTime: '8:00 PM',
  durationMinutes: 90,
  locationId: 'loc-1',
  locationName: 'Urban Climb West End',
  climbs: [
    {
      id: 'c1',
      levelName: 'Blue',
      levelColor: '#3b82f6',
      name: 'Slab project',
      tags: ['technical'],
      hasImage: false,
      hasVideo: false,
      isWarmUp: false,
      isRepeat: false,
      isProject: true,
      attempts: [{ id: 'a1', progress: ['flash', 'send'] }],
    },
  ],
  isPublic: false,
  ownerUsername: 'alex_climber',
  ownerAvatar: '🪨',
};

const meta = {
  title: 'Features/Sessions/SessionDetailView',
  component: SessionDetailView,
  args: {
    session: completedSession,
    duration: '1h 30m',
    shareVisible: false,
    showDeleteSheet: false,
    onContinueSession: fn(),
    onEditSession: fn(),
    onShare: fn(),
    onDeleteRequest: fn(),
    onConfirmDelete: fn(),
    onCancelDelete: fn(),
    onBackToSessions: fn(),
  },
} satisfies Meta<typeof SessionDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Completed: Story = {};

export const NotFound: Story = {
  args: { session: null },
};

export const DeleteSheet: Story = {
  args: { showDeleteSheet: true },
};
