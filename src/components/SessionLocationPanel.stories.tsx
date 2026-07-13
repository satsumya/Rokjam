import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';

import { SessionLocationPanel } from './SessionLocationPanel';
import { usePrototype } from '../context/PrototypeContext';
import { demoLevels, demoLocation, Padded, WithPrototype } from './storybook.helpers';

const meta = {
  title: 'Components/SessionLocationPanel',
  component: SessionLocationPanel,
  decorators: [WithPrototype, Padded],
  args: { sessionLocationId: '', onLocationLinked: fn() },
} satisfies Meta<typeof SessionLocationPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/** No locations yet — the empty state that prompts adding one. */
export const NoLocations: Story = {
  args: { sessionLocationId: '' },
};

/** Seeds a location into the prototype context, then links the session to it. */
function SeededPanel() {
  const { addLocationWithLevels } = usePrototype();
  const [locationId, setLocationId] = useState('');

  useEffect(() => {
    const id = addLocationWithLevels(demoLocation.name, demoLocation.nickname, demoLevels);
    setLocationId(id);
  }, [addLocationWithLevels]);

  if (!locationId) return null;
  return <SessionLocationPanel sessionLocationId={locationId} onLocationLinked={fn()} />;
}

export const LinkedLocation: Story = {
  render: () => <SeededPanel />,
};
