import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { AccountMenu } from '../molecules/AccountMenu';
import { Padded } from '../storybook.helpers';
import { ui } from '../../theme/colors';

const meta = {
  title: 'Molecules/AccountMenu',
  component: AccountMenu,
  decorators: [
    Padded,
    (Story) => (
      <View style={{ alignItems: 'flex-end', backgroundColor: ui.background, minHeight: 200 }}>
        <Story />
      </View>
    ),
  ],
  args: { onSignOut: fn() },
} satisfies Meta<typeof AccountMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
