import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { LevelDot } from './LevelDot';
import { demoLevels, Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/LevelDot',
  component: LevelDot,
  decorators: [Padded],
  args: { color: demoLevels[0].color },
} satisfies Meta<typeof LevelDot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {demoLevels.map((level, index) => (
        <LevelDot key={level.id} color={level.color} size={8 + index * 4} />
      ))}
    </View>
  ),
};
