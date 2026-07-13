import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { SessionClimbsList } from './SessionClimbsList';
import { demoClimbs, demoLocation, Padded } from '../storybook.helpers';

const meta = {
  title: 'Organisms/SessionClimbsList',
  component: SessionClimbsList,
  decorators: [Padded],
  args: { climbs: demoClimbs, location: demoLocation, onEditClimb: fn() },
} satisfies Meta<typeof SessionClimbsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { climbs: [] } };

export const WithActions: Story = {
  args: { onShareClimb: fn(), onRemoveClimb: fn(), onDifficultyChange: fn() },
};
