import type { Meta, StoryObj } from '@storybook/react-native';

import { FlowMapVersionAccordion } from './FlowMapVersionAccordion';
import { Padded } from './storybook.helpers';

const meta = {
  title: 'Components/FlowMapVersionAccordion',
  component: FlowMapVersionAccordion,
  decorators: [Padded],
} satisfies Meta<typeof FlowMapVersionAccordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Dashboard screen', version: '1.2.0', updatedAt: '2026-07-01T09:00:00.000Z' },
      { label: 'Session flow', version: '2.0.1', updatedAt: '2026-06-20T09:00:00.000Z' },
    ],
  },
};
