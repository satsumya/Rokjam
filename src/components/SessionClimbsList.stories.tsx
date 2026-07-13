import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { SessionClimbsList } from './SessionClimbsList';
import { demoClimbs, demoLocation, Padded } from './storybook.helpers';

const meta = {
  title: 'Components/SessionClimbsList',
  component: SessionClimbsList,
  decorators: [Padded],
  args: {
    location: demoLocation,
    onEditClimb: fn(),
    onShareClimb: fn(),
    onRemoveClimb: fn(),
    onDifficultyChange: fn(),
  },
} satisfies Meta<typeof SessionClimbsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithClimbs: Story = {
  args: { climbs: demoClimbs },
};

export const SingleClimb: Story = {
  args: { climbs: demoClimbs.slice(0, 1) },
};

export const Empty: Story = {
  args: { climbs: [] },
};
