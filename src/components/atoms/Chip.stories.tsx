import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Chip, RemovableChip } from './Chip';
import { Padded, StatesGallery, previewStateArgType } from '../storybook.helpers';
import { space } from '../../theme/spacing';

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  decorators: [Padded],
  args: { label: 'dyno', onPress: fn() },
  argTypes: { previewState: previewStateArgType },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Suggestion: Story = { args: { label: '+ crimpy' } };

export const Selected: Story = { args: { label: 'crimpy', selected: true } };

export const Removable: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
      <RemovableChip label="dyno" onPress={fn()} />
      <RemovableChip label="slab" onPress={fn()} />
    </View>
  ),
};

export const States: Story = {
  render: (args) => (
    <StatesGallery
      variants={[
        { id: 'suggestion', label: 'suggestion' },
        { id: 'selected', label: 'selected' },
      ]}
    >
      {(state, variantId) => (
        <Chip {...args} selected={variantId === 'selected'} previewState={state} />
      )}
    </StatesGallery>
  ),
};
