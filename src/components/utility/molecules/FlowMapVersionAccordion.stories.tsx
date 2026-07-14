import type { Meta, StoryObj } from '@storybook/react-native';

import { FlowMapVersionAccordion } from './FlowMapVersionAccordion';
import { Padded } from '../../storybook.helpers';

const meta = {
  title: 'Utility/Molecules/FlowMapVersionAccordion',
  component: FlowMapVersionAccordion,
  decorators: [Padded],
  args: {
    items: [
      { label: 'Sign up flow', version: '1.2.0', updatedAt: '2026-07-01T10:00:00.000Z' },
      { label: 'Welcome', version: '1.0.3', updatedAt: '2026-06-28T10:00:00.000Z' },
    ],
  },
} satisfies Meta<typeof FlowMapVersionAccordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
