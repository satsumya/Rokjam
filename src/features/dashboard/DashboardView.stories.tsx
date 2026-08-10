import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { DashboardView } from './DashboardView';

const meta = {
  title: 'Features/Dashboard/DashboardView',
  component: DashboardView,
  args: {
    needsProfile: true,
    avatar: '🪨',
    username: '',
    strengthTags: [],
    improvementTags: [],
    addingUsername: false,
    usernameDraft: '',
    canConfirmUsername: false,
    activeSessions: [],
    recentSessions: [],
    showAllSessions: false,
    onSignOut: fn(),
    onSetupProfile: fn(),
    onUsernameChange: fn(),
    onUsernameConfirm: fn(),
    onUsernameCancel: fn(),
    onStartAddUsername: fn(),
    onContinueSession: fn(),
    onShowRecentSessions: fn(),
    onShowAllSessions: fn(),
    onOpenSessionsList: fn(),
    onOpenSession: fn(),
    onAddLocationWithLevels: fn(),
  },
} satisfies Meta<typeof DashboardView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeedsProfile: Story = {};

export const ProfileComplete: Story = {
  args: {
    needsProfile: false,
    username: 'alex_climber',
    homeLocationNickname: 'Home gym',
    homeLocationName: 'Urban Climb West End',
    strengthTags: ['Crimpy', 'Overhang'],
    improvementTags: ['Footwork'],
  },
};

export const ActiveSession: Story = {
  args: {
    needsProfile: false,
    username: 'alex_climber',
    activeSessions: [
      {
        id: 'active-1',
        status: 'active',
        date: '2026-07-03',
        startTime: '6:30 PM',
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
