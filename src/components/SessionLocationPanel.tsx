import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AddressSearch } from './AddressSearch';
import { WireframeBox, WireframeLink } from './Wireframe';
import { usePrototype } from '../context/PrototypeContext';

export function SessionLocationPanel({
  sessionLocationId,
  onLocationLinked,
}: {
  sessionLocationId: string;
  onLocationLinked: (locationId: string, locationName: string) => void;
}) {
  const { locations, addLocation } = usePrototype();
  const [changingLocation, setChangingLocation] = useState(locations.length === 0);
  const [addingLocation, setAddingLocation] = useState(false);

  const sessionLoc = locations.find((l) => l.id === sessionLocationId) ?? locations[0];

  const handleAddLocation = (address: string) => {
    const id = addLocation(address);
    onLocationLinked(id, address);
    setAddingLocation(false);
    setChangingLocation(false);
  };

  if (locations.length === 0 || addingLocation) {
    return (
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '600' }}>Location</Text>
        <WireframeBox>
          <AddressSearch required={false} onSelect={handleAddLocation} />
        </WireframeBox>
        {addingLocation && locations.length > 0 ? (
          <WireframeLink label="Cancel" onPress={() => setAddingLocation(false)} />
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: '600' }}>Location</Text>
      {sessionLoc && !changingLocation ? (
        <WireframeBox>
          <Text>
            {sessionLoc.isHome ? '🏠 ' : ''}
            {sessionLoc.nickname ? `${sessionLoc.nickname} — ` : ''}
            {sessionLoc.name}
          </Text>
          {locations.length > 1 ? (
            <WireframeLink label="Change location" onPress={() => setChangingLocation(true)} />
          ) : null}
        </WireframeBox>
      ) : (
        <View style={{ gap: 6 }}>
          {locations.map((loc) => (
            <Pressable
              key={loc.id}
              onPress={() => {
                onLocationLinked(loc.id, loc.name);
                setChangingLocation(false);
              }}
            >
              <Text style={{ fontWeight: sessionLocationId === loc.id ? '700' : '400' }}>
                {loc.isHome ? '🏠 ' : ''}
                {loc.nickname ? `${loc.nickname} — ` : ''}
                {loc.name}
              </Text>
            </Pressable>
          ))}
          <WireframeLink label="Cancel" onPress={() => setChangingLocation(false)} />
        </View>
      )}
      {!addingLocation ? (
        <Pressable onPress={() => setAddingLocation(true)}>
          <Text style={{ color: '#666', fontSize: 14, textDecorationLine: 'underline' }}>
            Add new location
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
