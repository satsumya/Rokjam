import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { ActiveSessionView } from './ActiveSessionView';

const session = {
  id: 'active-1',
  status: 'active' as const,
  date: '2026-07-03',
  startTime: '6:30 PM',
  locationId: 'loc-1',
  locationName: 'Urban Climb West End',
  climbs: [],
  isPublic: false,
  ownerUsername: 'alex_climber',
  ownerAvatar: '🪨',
};

const meta = {
  title: 'Features/Sessions/ActiveSessionView',
  component: ActiveSessionView,
  args: {
    session,
    location: undefined,
    needsProfile: false,
    editingClimbId: null,
    draftClimb: null,
    showEndSheet: false,
    isPublic: false,
    endTime: '8:00 PM',
    durationMinutes: 90,
    customDuration: '',
    durationOptions: [{ value: '90', label: '1h 30m' }],
    usernameInput: '',
    username: 'alex_climber',
    climbPrompt: '',
    removeTarget: null,
    dateDisplay: 'Friday 03 Jul 2026',
    onPrimaryNav: fn(),
    onEndSessionRequest: fn(),
    onDateChange: fn(),
    onLocationLinked: fn(),
    onStartTimeChange: fn(),
    onDraftChange: fn(),
    onCancelClimbEdit: fn(),
    onEditClimb: fn(),
    onRemoveClimb: fn(),
    onDifficultyChange: fn(),
    onSetPrivate: fn(),
    onSetPublic: fn(),
    onUsernameInputChange: fn(),
    onEndTimeChange: fn(),
    onDurationPresetChange: fn(),
    onCustomDurationChange: fn(),
    onConfirmEndSession: fn(),
    onCancelEndSheet: fn(),
    onConfirmRemoveClimb: fn(),
    onCancelRemoveClimb: fn(),
    onBackToDashboard: fn(),
  },
} satisfies Meta<typeof ActiveSessionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EndSheet: Story = {
  args: { showEndSheet: true },
};

export const NotFound: Story = {
  args: { session: null, dateDisplay: '' },
};
