import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Chip, RemovableChip } from './Chip';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  decorators: [Padded],
  args: { label: 'dyno', onPress: fn() },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Suggestion: Story = { args: { label: '+ crimpy' } };

export const Selected: Story = { args: { label: 'crimpy', selected: true } };

export const Removable: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <RemovableChip label="dyno" onPress={fn()} />
      <RemovableChip label="slab" onPress={fn()} />
    </View>
  ),
};
