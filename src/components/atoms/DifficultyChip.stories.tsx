import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { DifficultyChip } from './DifficultyChip';
import { demoLevels, Padded, StatesGallery, previewStateArgType } from '../storybook.helpers';

const meta = {
  title: 'Atoms/DifficultyChip',
  component: DifficultyChip,
  decorators: [Padded],
  args: { color: demoLevels[1].color, name: demoLevels[1].name, onPress: fn() },
  argTypes: { previewState: previewStateArgType },
} satisfies Meta<typeof DifficultyChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};
export const Selected: Story = { args: { selected: true } };

export const States: Story = {
  render: (args) => (
    <StatesGallery
      variants={[
        { id: 'unselected', label: 'unselected' },
        { id: 'selected', label: 'selected' },
      ]}
    >
      {(state, variantId) => (
        <DifficultyChip {...args} selected={variantId === 'selected'} previewState={state} />
      )}
    </StatesGallery>
  ),
};

export const Row: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {demoLevels.map((level, index) => (
        <DifficultyChip
          key={level.id}
          color={level.color}
          name={level.name}
          selected={index === 1}
          onPress={fn()}
        />
      ))}
    </View>
  ),
};
