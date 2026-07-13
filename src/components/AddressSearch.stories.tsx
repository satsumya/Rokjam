import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { AddressSearch } from './AddressSearch';
import { Padded } from './storybook.helpers';

const meta = {
  title: 'Components/AddressSearch',
  component: AddressSearch,
  decorators: [Padded],
  args: { onSelect: fn() },
} satisfies Meta<typeof AddressSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Search and select a location first' },
};
