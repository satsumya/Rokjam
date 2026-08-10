import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ProfileSummaryCard } from './ProfileSummaryCard';
import { Padded, WithPrototype } from '../storybook.helpers';
import type { DifficultyLevel } from '../../domain/types/profile';

const mockAddLocation = (_name: string, _nickname: string | undefined, levels: DifficultyLevel[]) =>
  `story-loc-${levels.length}`;

const meta = {
  title: 'Organisms/ProfileSummaryCard',
  component: ProfileSummaryCard,
  decorators: [WithPrototype, Padded],
  args: {
    avatar: '🪨',
    username: 'thegoat',
    locationNickname: 'Home gym',
    locationName: 'Urban Climb West End',
    strengthTags: ['Slab', 'Balance'],
    improvementTags: ['Footwork'],
    onAddLocationWithLevels: mockAddLocation,
  },
} satisfies Meta<typeof ProfileSummaryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Complete: Story = {};

export const StrengthsOnly: Story = {
  args: { improvementTags: [] },
};

export const NoTags: Story = {
  args: { strengthTags: [], improvementTags: [] },
};

export const NoLocation: Story = {
  args: {
    username: '',
    locationNickname: undefined,
    locationName: undefined,
    strengthTags: [],
    improvementTags: [],
  },
};

export const AddUsername: Story = {
  render: (args) => {
    const [adding, setAdding] = useState(true);
    const [draft, setDraft] = useState('');
    const [username, setUsername] = useState('');
    const canConfirm = draft.trim().length >= 3 && draft.trim() !== 'thegoat';

    return (
      <ProfileSummaryCard
        {...args}
        username={username}
        locationNickname={undefined}
        locationName={undefined}
        strengthTags={[]}
        improvementTags={[]}
        addingUsername={adding && !username}
        usernameDraft={draft}
        usernameError={
          draft.trim() === 'thegoat' ? 'Username already taken' : undefined
        }
        usernameSuccess={canConfirm ? 'Username available' : undefined}
        canConfirmUsername={canConfirm}
        onUsernameChange={setDraft}
        onUsernameConfirm={() => {
          setUsername(draft.trim());
          setAdding(false);
          setDraft('');
        }}
        onUsernameCancel={() => {
          setAdding(false);
          setDraft('');
        }}
        onStartAddUsername={() => {
          setAdding(true);
          setDraft('');
        }}
      />
    );
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState('');
    const [username, setUsername] = useState(args.username);
    const canConfirm = Boolean(draft.trim()) && draft.trim() !== 'thegoat';

    return (
      <ProfileSummaryCard
        {...args}
        username={username}
        addingUsername={adding && !username.trim()}
        usernameDraft={draft}
        usernameSuccess={canConfirm ? 'Username available' : undefined}
        canConfirmUsername={canConfirm}
        onUsernameChange={setDraft}
        onUsernameConfirm={() => {
          setUsername(draft.trim());
          setAdding(false);
          setDraft('');
        }}
        onUsernameCancel={() => {
          setAdding(false);
          setDraft('');
        }}
        onStartAddUsername={() => {
          setAdding(true);
          setDraft('');
        }}
      />
    );
  },
};
