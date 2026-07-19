import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { DashboardTrends } from './DashboardTrends';
import {
  createFlowManySessions,
  createFlowSecondaryLocationLevels,
} from '../../constants/flowDemoSessions';
import type { Location } from '../../context/PrototypeContext';
import type { TrendTimeframe } from '../../types/climbingSession';
import { demoLocation, Padded } from '../storybook.helpers';

const secondLocation: Location = {
  id: 'demo-location-kp',
  name: 'Kangaroo Point Cliffs, River Terrace Brisbane',
  nickname: 'KP cliffs',
  isHome: false,
  levelSort: 'easy-hard',
  levels: createFlowSecondaryLocationLevels(),
};

const richSessions = createFlowManySessions(
  { id: demoLocation.id, name: demoLocation.name, levels: demoLocation.levels },
  { id: secondLocation.id, name: secondLocation.name, levels: secondLocation.levels },
);

const meta = {
  title: 'Organisms/DashboardTrends',
  component: DashboardTrends,
  decorators: [Padded],
  args: {
    sessions: richSessions,
    locations: [demoLocation, secondLocation],
    timeframe: '3months',
    onTimeframeChange: fn(),
  },
} satisfies Meta<typeof DashboardTrends>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [timeframe, setTimeframe] = useState<TrendTimeframe>('3months');
    return <DashboardTrends {...args} timeframe={timeframe} onTimeframeChange={setTimeframe} />;
  },
};

export const Empty: Story = { args: { sessions: [], locations: [demoLocation] } };
