import type { Meta, StoryObj } from '@storybook/react-native';

import { HintList } from './HintList';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/HintList',
  component: HintList,
  decorators: [Padded],
  args: {
    items: [
      { label: 'At least 8 characters', met: true },
      { label: 'At least one number', met: true },
      { label: 'At least one symbol', met: false },
    ],
  },
} satisfies Meta<typeof HintList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllMet: Story = {
  args: {
    items: [
      { label: 'At least 8 characters', met: true },
      { label: 'At least one number', met: true },
      { label: 'At least one symbol', met: true },
    ],
  },
};
