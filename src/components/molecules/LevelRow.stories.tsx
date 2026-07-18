import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { LevelRow } from './LevelRow';
import { demoLevels, Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/LevelRow',
  component: LevelRow,
  decorators: [Padded],
  args: {
    level: demoLevels[0],
    index: 0,
    total: 3,
    takenColors: demoLevels.slice(1).map((level) => level.color),
    onUpdate: fn(),
    onMoveUp: fn(),
    onMoveDown: fn(),
    onRemove: fn(),
    onReorder: fn(),
  },
} satisfies Meta<typeof LevelRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  render: (args) => {
    const [level, setLevel] = useState(demoLevels[0]);
    return <LevelRow {...args} level={level} onUpdate={(patch) => setLevel((c) => ({ ...c, ...patch }))} />;
  },
};
