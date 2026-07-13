import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

import { Card } from './Card';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/Card',
  component: Card,
  decorators: [Padded],
  args: {
    children: (
      <>
        <Text style={{ fontWeight: '700' }}>Session in progress</Text>
        <Text>Tap to continue logging climbs</Text>
      </>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
