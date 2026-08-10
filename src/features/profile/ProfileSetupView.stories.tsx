import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { DEFAULT_LEVEL_COLORS } from '../../constants/difficultyLevels';

import { ProfileSetupView } from './ProfileSetupView';

const demoLocation = {
  id: 'demo-location',
  name: 'Urban Climb West End, Montague Rd Brisbane',
  nickname: 'Home gym',
  isHome: true,
  levelSort: 'easy-hard' as const,
  levels: DEFAULT_LEVEL_COLORS.slice(0, 3).map((preset, index) => ({
    id: `level-${index}`,
    name: preset.name,
    color: preset.color,
  })),
};

const noopHandlers = {
  onAvatarSelect: fn(),
  onUsernameDraftChange: fn(),
  onConfirmUsername: fn(),
  onExit: fn(),
  onGoToDashboard: fn(),
  onToggleLocation: fn(),
  onAddLocation: fn(),
  onUpdateLocation: fn(),
  onSetHomeLocation: fn(),
  onDeleteLocationRequest: fn(),
  onConfirmDeleteLocation: fn(),
  onCancelDeleteLocation: fn(),
  onToggleLevelSort: fn(),
  onRunLevelEdit: fn(),
  onUpdateLevel: fn(),
  onMoveLevel: fn(),
  onRemoveLevel: fn(),
  onReorderLevels: fn(),
  onAddLevel: fn(),
  onClearLevelsNudge: fn(),
  onAddStrengthTag: fn(),
  onRemoveStrengthTag: fn(),
  onAddImprovementTag: fn(),
  onRemoveImprovementTag: fn(),
  onConfirmLevelImpact: fn(),
  onCancelLevelImpact: fn(),
};

const meta = {
  title: 'Features/Profile/ProfileSetupView',
  component: ProfileSetupView,
  args: {
    avatar: '🪨',
    usernameDraft: '',
    canConfirmUsername: false,
    isEditingCompleteProfile: false,
    locations: [],
    openLocationId: null,
    levelsNudgeLocationId: null,
    deleteTarget: undefined,
    levelImpactPending: false,
    strengthTags: [],
    improvementTags: [],
    ...noopHandlers,
  },
} satisfies Meta<typeof ProfileSetupView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NewUser: Story = {};

export const WithLocation: Story = {
  args: {
    locations: [demoLocation],
    openLocationId: demoLocation.id,
  },
};

export const UsernameAvailable: Story = {
  args: {
    usernameDraft: 'alex_climber',
    usernameSuccess: 'Username available',
    canConfirmUsername: true,
  },
};
