import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ClimbAtGlance, ClimbEditor, SessionRow, ShareMockBanner } from './SessionClimb';
import { demoClimb, demoClimbMinimal, demoLocation, Padded } from './storybook.helpers';

const meta = {
  title: 'Components/SessionClimb',
  component: ClimbAtGlance,
  decorators: [Padded],
  args: { climb: demoClimb },
} satisfies Meta<typeof ClimbAtGlance>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AtGlance: Story = {
  args: {
    climb: demoClimb,
    location: demoLocation,
    onPress: fn(),
    onShare: fn(),
    onRemove: fn(),
    onDifficultyChange: fn(),
  },
};

export const AtGlanceMinimal: Story = {
  args: {
    climb: demoClimbMinimal,
    location: demoLocation,
    onPress: fn(),
  },
};

export const Editor: Story = {
  render: () => {
    const [climb, setClimb] = useState(demoClimb);
    return (
      <ClimbEditor
        climb={climb}
        location={demoLocation}
        onChange={(patch) => setClimb((current) => ({ ...current, ...patch }))}
        onShare={fn()}
      />
    );
  },
};

export const ShareBanner: Story = {
  render: () => <ShareMockBanner visible />,
};

export const Row: Story = {
  render: () => (
    <SessionRow
      date="2026-07-10"
      duration="45m"
      climbCount={6}
      difficultyRange="Yellow–Purple"
      location="Urban Climb West End"
      onPress={fn()}
    />
  ),
};
