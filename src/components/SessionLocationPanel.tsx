import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AddLocationSheet } from './AddLocationSheet';
import { WireframeBox, WireframeButton, WireframeLink } from './Wireframe';
import { usePrototype } from '../context/PrototypeContext';
import { ui } from '../theme/colors';

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
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '600' }}>Location</Text>
        <WireframeBox>
          <Text>No location linked to this session yet.</Text>
          <Text style={{ color: ui.textMuted, fontSize: 13, lineHeight: 18 }}>
            Search for your gym or crag and set up difficulty levels.
          </Text>
          <WireframeButton label="Add location" onPress={() => setShowAddSheet(true)} />
        </WireframeBox>
        {addSheet}
      </View>
    );
  }

  if (!sessionLoc || changingLocation) {
    return (
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '600' }}>Location</Text>
        <WireframeBox>
          <Text>{sessionLoc ? 'Choose a different location' : 'Select a location for this session'}</Text>
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
          </View>
          {sessionLoc ? (
            <WireframeLink label="Cancel" onPress={() => setChangingLocation(false)} />
          ) : null}
        </WireframeBox>
        <Pressable onPress={() => setShowAddSheet(true)}>
          <Text style={{ color: ui.textMuted, fontSize: 14, textDecorationLine: 'underline' }}>
            Add new location
          </Text>
        </Pressable>
        {addSheet}
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: '600' }}>Location</Text>
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
      <Pressable onPress={() => setShowAddSheet(true)}>
        <Text style={{ color: ui.textMuted, fontSize: 14, textDecorationLine: 'underline' }}>
          Add new location
        </Text>
      </Pressable>
      {addSheet}
    </View>
  );
}
