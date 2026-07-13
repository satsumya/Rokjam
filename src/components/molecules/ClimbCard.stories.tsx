import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { ClimbCard } from './ClimbCard';
import { demoClimb, demoClimbMinimal, demoLocation, Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/ClimbCard',
  component: ClimbCard,
  decorators: [Padded],
  args: { climb: demoClimb, location: demoLocation, onPress: fn() },
} satisfies Meta<typeof ClimbCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = { args: { climb: demoClimbMinimal } };

export const ReadOnlyWithShare: Story = {
  args: { climb: demoClimb, location: undefined, onPress: undefined, onShare: fn() },
};

export const EditableDifficulty: Story = {
  args: { climb: demoClimb, location: demoLocation, onDifficultyChange: fn(), onRemove: fn() },
};
