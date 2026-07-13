import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { Link } from './Link';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/Link',
  component: Link,
  decorators: [Padded],
  args: { label: 'Back to dashboard', onPress: fn() },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
