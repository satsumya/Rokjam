import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { SessionLocationPanel } from './SessionLocationPanel';
import { Padded, WithPrototype } from '../storybook.helpers';

const meta = {
  title: 'Organisms/SessionLocationPanel',
  component: SessionLocationPanel,
  decorators: [WithPrototype, Padded],
  args: { sessionLocationId: '', onLocationLinked: fn() },
} satisfies Meta<typeof SessionLocationPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
