import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { EditSessionView } from './EditSessionView';

const session = {
  id: 's1',
  status: 'completed' as const,
  date: '2026-07-03',
  startTime: '6:30 PM',
  endTime: '8:00 PM',
  locationId: 'loc-1',
  locationName: 'Urban Climb West End',
  climbs: [],
  isPublic: false,
  ownerUsername: 'alex_climber',
  ownerAvatar: '🪨',
};

const meta = {
  title: 'Features/Sessions/EditSessionView',
  component: EditSessionView,
  args: {
    session,
    location: undefined,
    canEdit: true,
    editingClimbId: null,
    draftClimb: null,
    isPublic: false,
    publicError: '',
    removeTarget: null,
    onSaveSession: fn(),
    onCancel: fn(),
    onDateChange: fn(),
    onStartTimeChange: fn(),
    onEndTimeChange: fn(),
    onSetPrivate: fn(),
    onSetPublic: fn(),
    onAddClimb: fn(),
    onEditClimb: fn(),
    onRemoveClimb: fn(),
    onDifficultyChange: fn(),
    onDraftChange: fn(),
    onSaveClimb: fn(),
    onCancelClimbEdit: fn(),
    onConfirmRemoveClimb: fn(),
    onCancelRemoveClimb: fn(),
    onBack: fn(),
  },
} satisfies Meta<typeof EditSessionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CannotEdit: Story = {
  args: { canEdit: false, session: null },
};
