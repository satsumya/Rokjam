import { useMemo, useState } from 'react';
import { View, type ViewProps } from 'react-native';

import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Dropdown } from '../molecules/Dropdown';
import { AddLocationSheet } from './AddLocationSheet';
import { usePrototype } from '../../context/PrototypeContext';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

const ADD_LOCATION_VALUE = '__add_location__';

function SessionLocationEmpty({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function locationLabel(loc: { nickname?: string; name: string; isHome?: boolean }) {
  const name = loc.nickname?.trim() || loc.name;
  return name;
}

export function SessionLocationPanel({
  sessionLocationId,
  onLocationLinked,
}: {
  sessionLocationId: string;
  onLocationLinked: (locationId: string, locationName: string) => void;
}) {
  const { locations } = usePrototype();
  const [showAddSheet, setShowAddSheet] = useState(false);

  const options = useMemo(
    () => [
      ...locations.map((loc) => ({
        value: loc.id,
        label: locationLabel(loc),
      })),
      { value: ADD_LOCATION_VALUE, label: 'Add new location' },
    ],
    [locations],
  );

  const handleLocationSaved = (locationId: string, locationName: string) => {
    onLocationLinked(locationId, locationName);
    setShowAddSheet(false);
  };

  const addSheet = (
    <AddLocationSheet
      visible={showAddSheet}
      onClose={() => setShowAddSheet(false)}
      onSaved={handleLocationSaved}
    />
  );

  if (locations.length === 0) {
    return (
      <SessionLocationEmpty style={{ gap: space[8] }}>
        <Text variant="body">No location linked to this session yet.</Text>
        <Text variant="bodySmall" color={ui.textMuted}>
          Search for your gym or crag and set up difficulty levels.
        </Text>
        <Button label="Add location" onPress={() => setShowAddSheet(true)} />
        {addSheet}
      </SessionLocationEmpty>
    );
  }

  return (
    <>
      <Dropdown
        label="Location"
        value={sessionLocationId}
        options={options}
        onChange={(value) => {
          if (value === ADD_LOCATION_VALUE) {
            setShowAddSheet(true);
            return;
          }
          const loc = locations.find((item) => item.id === value);
          if (loc) onLocationLinked(loc.id, loc.name);
        }}
      />
      {addSheet}
    </>
  );
}
