import { useState } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Link } from '../atoms/Link';
import { Text } from '../atoms/Text';
import { AddLocationSheet } from './AddLocationSheet';
import { usePrototype } from '../../context/PrototypeContext';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

function SessionLocationEmpty({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SessionLocationPicker({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SessionLocationList({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SessionLocationOption({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SessionLocationSummary({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SessionLocationNameRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function SessionLocationActions({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

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

  if (!sessionLoc || changingLocation) {
    return (
      <SessionLocationPicker style={{ gap: space[8] }}>
        <Text variant="body" weight="bold">
          {sessionLoc ? 'Choose a different location' : 'Select a location for this session'}
        </Text>
        <SessionLocationList style={{ gap: space[6] }}>
          {locations.map((loc) => (
            <Pressable
              key={loc.id}
              onPress={() => {
                onLocationLinked(loc.id, loc.name);
                setChangingLocation(false);
              }}
            >
              <SessionLocationOption style={{ flexDirection: 'row', alignItems: 'center', gap: space[4] }}>
                {loc.isHome ? <Icon name="house" size="xs" color={ui.text} /> : null}
                <Text
                  variant="body"
                  weight={sessionLocationId === loc.id ? 'bold' : 'regular'}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  {loc.nickname ? `${loc.nickname} — ` : ''}
                  {loc.name}
                </Text>
              </SessionLocationOption>
            </Pressable>
          ))}
        </SessionLocationList>
        {sessionLoc ? <Link label="Cancel" onPress={() => setChangingLocation(false)} /> : null}
        <Pressable onPress={() => setShowAddSheet(true)}>
          <Text variant="bodySmall" color={ui.textMuted} style={{ textDecorationLine: 'underline' }}>
            Add new location
          </Text>
        </Pressable>
        {addSheet}
      </SessionLocationPicker>
    );
  }

  return (
    <SessionLocationSummary style={{ gap: space[6] }}>
      <SessionLocationNameRow style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space[4] }}>
        {sessionLoc.isHome ? <Icon name="house" size="xs" color={ui.text} /> : null}
        <Text variant="body" style={{ flex: 1, minWidth: 0 }}>
          {sessionLoc.nickname ? `${sessionLoc.nickname} — ` : ''}
          {sessionLoc.name}
        </Text>
      </SessionLocationNameRow>
      <SessionLocationActions style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[12] }}>
        {locations.length > 1 ? (
          <Link label="Change location" onPress={() => setChangingLocation(true)} />
        ) : null}
        <Pressable onPress={() => setShowAddSheet(true)}>
          <Text variant="bodySmall" color={ui.textMuted} style={{ textDecorationLine: 'underline' }}>
            Add new location
          </Text>
        </Pressable>
      </SessionLocationActions>
      {addSheet}
    </SessionLocationSummary>
  );
}
