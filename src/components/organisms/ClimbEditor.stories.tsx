import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { ClimbEditor } from './ClimbEditor';
import type { SessionClimb } from '../../types/climbingSession';
import { demoClimb, demoLocation, Padded } from '../storybook.helpers';

const meta = {
  title: 'Organisms/ClimbEditor',
  component: ClimbEditor,
  decorators: [Padded],
  args: { climb: demoClimb, location: demoLocation, onChange: fn() },
} satisfies Meta<typeof ClimbEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [climb, setClimb] = useState<SessionClimb>(demoClimb);
    return <ClimbEditor {...args} climb={climb} onChange={(patch) => setClimb((c) => ({ ...c, ...patch }))} />;
  },
};

export const NoLocationLevels: Story = {
  args: { location: undefined },
  render: (args) => {
    const [climb, setClimb] = useState<SessionClimb>(demoClimb);
    return <ClimbEditor {...args} climb={climb} onChange={(patch) => setClimb((c) => ({ ...c, ...patch }))} />;
  },
};
