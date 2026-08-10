import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect } from 'react';
import { fn } from 'storybook/test';

import { SessionLocationPanel } from './SessionLocationPanel';
import { Padded, WithPrototype } from '../storybook.helpers';
import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { useProfile } from '../../data/hooks/useProfile';

const meta = {
  title: 'Organisms/SessionLocationPanel',
  component: SessionLocationPanel,
  decorators: [WithPrototype, Padded],
  args: { sessionLocationId: '', onLocationLinked: fn() },
} satisfies Meta<typeof SessionLocationPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/** No saved locations — Add location button + modal. */
export const Empty: Story = {};

/** At least one location — Location dropdown with Add new location option. */
export const WithLocations: Story = {
  render: (args) => {
    const { locations } = useProfile();
    const { seedDemoProfileOnly } = useMockSeeding();

    useEffect(() => {
      if (locations.length === 0) seedDemoProfileOnly();
    }, [locations.length, seedDemoProfileOnly]);

    const locationId = locations[0]?.id ?? args.sessionLocationId;

    return (
      <SessionLocationPanel
        {...args}
        sessionLocationId={locationId}
        onLocationLinked={args.onLocationLinked}
      />
    );
  },
};
