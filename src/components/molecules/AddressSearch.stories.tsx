import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { AddressSearch } from './AddressSearch';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Molecules/AddressSearch',
  component: AddressSearch,
  decorators: [Padded],
  args: { onSelect: fn() },
} satisfies Meta<typeof AddressSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Add at least one gym or climbing location' },
};
