import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { SessionBottomNav } from './SessionBottomNav';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

const meta = {
  title: 'Organisms/SessionBottomNav',
  component: SessionBottomNav,
  args: {
    onPrimary: fn(),
    onEndSession: fn(),
    primaryMode: 'add',
  },
  argTypes: {
    primaryMode: { control: 'select', options: ['add', 'save'] },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: ui.background, minHeight: 120 }}>
        <View style={{ maxWidth: 640, width: '100%', alignSelf: 'center' }}>
          <Story />
        </View>
      </View>
    ),
  ],
} satisfies Meta<typeof SessionBottomNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddClimb: Story = {};

export const SaveClimb: Story = {
  args: { primaryMode: 'save' },
};

export const BothModes: Story = {
  render: (args) => (
    <View style={{ gap: space[24] }}>
      <SessionBottomNav {...args} primaryMode="add" />
      <SessionBottomNav {...args} primaryMode="save" />
    </View>
  ),
};
