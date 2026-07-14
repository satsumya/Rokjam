import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Link } from '../atoms/Link';
import { Text } from '../atoms/Text';
import { AddLocationSheet } from './AddLocationSheet';
import { usePrototype } from '../../context/PrototypeContext';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export function SessionLocationPanel({
  sessionLocationId,
  onLocationLinked,
}: {
  sessionLocationId: string;
  onLocationLinked: (locationId: string, locationName: string) => void;
}) {
  const { locations } = usePrototype();
  const [changingLocation, setChangingLocation] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const sessionLoc = locations.find((l) => l.id === sessionLocationId);

  const handleLocationSaved = (locationId: string, locationName: string) => {
    onLocationLinked(locationId, locationName);
    setChangingLocation(false);
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
      <View style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          Location
        </Text>
        <Card>
          <Text variant="body">No location linked to this session yet.</Text>
          <Text variant="bodySmall" color={ui.textMuted}>
            Search for your gym or crag and set up difficulty levels.
          </Text>
          <Button label="Add location" onPress={() => setShowAddSheet(true)} />
        </Card>
        {addSheet}
      </View>
    );
  }

  if (!sessionLoc || changingLocation) {
    return (
      <View style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          Location
        </Text>
        <Card>
          <Text variant="body">
            {sessionLoc ? 'Choose a different location' : 'Select a location for this session'}
          </Text>
          <View style={{ gap: space[6] }}>
            {locations.map((loc) => (
              <Pressable
                key={loc.id}
                onPress={() => {
                  onLocationLinked(loc.id, loc.name);
                  setChangingLocation(false);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
                  {loc.isHome ? <Icon name="house" size="xs" color={ui.text} /> : null}
                  <Text variant="body" weight={sessionLocationId === loc.id ? 'bold' : 'regular'}>
                    {loc.nickname ? `${loc.nickname} — ` : ''}
                    {loc.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
          {sessionLoc ? (
            <Link label="Cancel" onPress={() => setChangingLocation(false)} />
          ) : null}
        </Card>
        <Pressable onPress={() => setShowAddSheet(true)}>
          <Text variant="bodySmall" color={ui.textMuted} style={{ textDecorationLine: 'underline' }}>
            Add new location
          </Text>
        </Pressable>
        {addSheet}
      </View>
    );
  }

  return (
    <View style={{ gap: space[8] }}>
      <Text variant="body" weight="bold">
        Location
      </Text>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
          {sessionLoc.isHome ? <Icon name="house" size="xs" color={ui.text} /> : null}
          <Text variant="body">
            {sessionLoc.nickname ? `${sessionLoc.nickname} — ` : ''}
            {sessionLoc.name}
          </Text>
        </View>
        {locations.length > 1 ? (
          <Link label="Change location" onPress={() => setChangingLocation(true)} />
        ) : null}
      </Card>
      <Pressable onPress={() => setShowAddSheet(true)}>
        <Text variant="bodySmall" color={ui.textMuted} style={{ textDecorationLine: 'underline' }}>
          Add new location
        </Text>
      </Pressable>
      {addSheet}
    </View>
  );
}
