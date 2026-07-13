import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { DifficultyPicker } from './DifficultyPicker';
import { demoLevels, Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/DifficultyPicker',
  component: DifficultyPicker,
  decorators: [Padded],
  args: { levels: demoLevels, title: 'Difficulty', onSelect: fn() },
} satisfies Meta<typeof DifficultyPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | undefined>(demoLevels[1].id);
    return <DifficultyPicker {...args} selectedLevelId={selected} onSelect={(level) => setSelected(level.id)} />;
  },
};

export const Compact: Story = {
  args: { title: 'Add difficulty', compact: true },
  render: (args) => {
    const [selected, setSelected] = useState<string | undefined>(undefined);
    return <DifficultyPicker {...args} selectedLevelId={selected} onSelect={(level) => setSelected(level.id)} />;
  },
};
