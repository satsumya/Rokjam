import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect } from 'react';
import { fn } from 'storybook/test';

import { SessionLocationPanel } from './SessionLocationPanel';
import { Padded, WithPrototype } from '../storybook.helpers';
import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { useProfile } from '../../data/hooks/useProfile';
import type { DifficultyLevel } from '../../domain/types/profile';

const mockAddLocation = (_name: string, _nickname: string | undefined, levels: DifficultyLevel[]) =>
  `story-loc-${levels.length}`;

const meta = {
  title: 'Organisms/SessionLocationPanel',
  component: SessionLocationPanel,
  decorators: [WithPrototype, Padded],
  args: {
    locations: [],
    sessionLocationId: '',
    onLocationLinked: fn(),
    onAddLocationWithLevels: mockAddLocation,
  },
} satisfies Meta<typeof SessionLocationPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/** No saved locations — Add location button + modal. */
export const Empty: Story = {};

/** At least one location — Location dropdown with Add new location option. */
export const WithLocations: Story = {
  render: (args) => {
    const { locations, addLocationWithLevels } = useProfile();
    const { seedDemoProfileOnly } = useMockSeeding();

    useEffect(() => {
      if (locations.length === 0) seedDemoProfileOnly();
    }, [locations.length, seedDemoProfileOnly]);

    const locationId = locations[0]?.id ?? args.sessionLocationId;

    return (
      <SessionLocationPanel
        {...args}
        locations={locations}
        sessionLocationId={locationId}
        onLocationLinked={args.onLocationLinked}
        onAddLocationWithLevels={addLocationWithLevels}
      />
    );
  },
};
