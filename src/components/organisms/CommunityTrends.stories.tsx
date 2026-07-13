import type { Meta, StoryObj } from '@storybook/react-native';

import { CommunityTrends } from './CommunityTrends';
import { demoSessions, Padded } from '../storybook.helpers';

const meta = {
  title: 'Organisms/CommunityTrends',
  component: CommunityTrends,
  decorators: [Padded],
  args: { sessions: demoSessions },
} satisfies Meta<typeof CommunityTrends>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { sessions: [] } };
