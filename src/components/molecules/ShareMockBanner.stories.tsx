import type { Meta, StoryObj } from '@storybook/react-native';

import { ShareMockBanner } from './ShareMockBanner';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/ShareMockBanner',
  component: ShareMockBanner,
  decorators: [Padded],
  args: { visible: true },
} satisfies Meta<typeof ShareMockBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Visible: Story = {};
export const Hidden: Story = { args: { visible: false } };
