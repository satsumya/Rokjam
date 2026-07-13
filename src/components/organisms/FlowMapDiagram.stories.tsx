import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { FlowMapDiagram } from './FlowMapDiagram';
import type { FlowNavigateContext } from '../../constants/flowMap';
import { Padded } from '../storybook.helpers';

const navigateCtx: FlowNavigateContext = {
  resetSession: fn(),
  seedReturningUser: fn(),
  seedDemoProfileOnly: fn(),
  seedDemoSessions: fn(),
  seedDemoActiveSession: fn(),
  seedFlowDemo: fn(),
  setEmail: fn(),
};

const meta = {
  title: 'Organisms/FlowMapDiagram',
  component: FlowMapDiagram,
  decorators: [Padded],
  args: { navigateCtx, journeyFilter: 'all' },
} satisfies Meta<typeof FlowMapDiagram>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllJourneys: Story = {};
