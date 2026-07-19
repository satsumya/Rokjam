import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { BottomNav } from './BottomNav';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

const meta = {
  title: 'Organisms/BottomNav',
  component: BottomNav,
  args: { active: 'home' },
  argTypes: {
    active: {
      control: 'select',
      options: ['home', 'sessions', 'insights', 'community'],
    },
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
} satisfies Meta<typeof BottomNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Home: Story = {};

export const Sessions: Story = { args: { active: 'sessions' } };

export const Insights: Story = { args: { active: 'insights' } };

export const Community: Story = { args: { active: 'community' } };

export const AllTabs: Story = {
  render: () => (
    <View style={{ gap: space[24] }}>
      {(['home', 'sessions', 'insights', 'community'] as const).map((tab) => (
        <BottomNav key={tab} active={tab} />
      ))}
    </View>
  ),
};
