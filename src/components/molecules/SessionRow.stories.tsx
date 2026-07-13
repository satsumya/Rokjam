import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { SessionRow } from './SessionRow';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/SessionRow',
  component: SessionRow,
  decorators: [Padded],
  args: {
    date: '2026-07-03',
    duration: '1h 30m',
    climbCount: 8,
    difficultyRange: 'Green → Blue',
    location: 'Urban Climb West End',
    onPress: fn(),
  },
} satisfies Meta<typeof SessionRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleClimb: Story = { args: { climbCount: 1 } };
