import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

import { PrototypeOnly } from './PrototypeOnly';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/PrototypeOnly',
  component: PrototypeOnly,
  decorators: [Padded],
  args: {
    children: <Text>Visible in prototype mode only (hidden in production and during flow-map capture).</Text>,
  },
} satisfies Meta<typeof PrototypeOnly>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
