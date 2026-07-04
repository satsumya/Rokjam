import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AddressSearch } from './AddressSearch';
import { LevelRow } from './LevelRow';
import { WireframeBox, WireframeButton, WireframeField, WireframeSection } from './Wireframe';
import type { Location } from '../context/PrototypeContext';
import { usePrototype } from '../context/PrototypeContext';

export function SessionLocationPanel({
  sessionLocationId,
  onLocationLinked,
}: {
  sessionLocationId: string;
  onLocationLinked: (locationId: string, locationName: string) => void;
}) {
  const {
    locations,
    addLocation,
    updateLocation,
    setHomeLocation,
    addLevel,
    removeLevel,
    moveLevel,
    swapLevels,
    toggleLevelSort,
    updateLevel,
  } = usePrototype();

  const [addingLocation, setAddingLocation] = useState(locations.length === 0);
  const [openLocationId, setOpenLocationId] = useState<string | null>(
    sessionLocationId || locations[0]?.id || null,
  );
  const [editNickname, setEditNickname] = useState('');
  const [dragSourceId, setDragSourceId] = useState<string | null>(null);

  const handleAddLocation = (address: string) => {
    const id = addLocation(address);
    onLocationLinked(id, address);
    setOpenLocationId(id);
    setAddingLocation(false);
  };

  const openLoc = locations.find((l) => l.id === openLocationId);

  return (
    <View style={{ gap: 8 }}>
      {locations.length > 0 ? (
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: '600' }}>Location</Text>
          {locations.map((loc) => (
            <Pressable
              key={loc.id}
              onPress={() => {
                setOpenLocationId(loc.id);
                onLocationLinked(loc.id, loc.name);
              }}
            >
              <Text style={{ fontWeight: sessionLocationId === loc.id ? '700' : '400' }}>
                {loc.isHome ? '🏠 ' : ''}
                {loc.nickname ? `${loc.nickname} — ` : ''}
                {loc.name}
              </Text>
            </Pressable>
          ))}
          {!addingLocation ? (
            <WireframeButton label="Add another location" variant="ghost" onPress={() => setAddingLocation(true)} />
          ) : null}
        </View>
      ) : null}

      {addingLocation || locations.length === 0 ? (
        <WireframeBox>
          <AddressSearch required={false} onSelect={handleAddLocation} />
        </WireframeBox>
      ) : null}

      {openLoc ? (
        <WireframeSection title="Location details">
          <WireframeField
            label="Nickname"
            value={editNickname || openLoc.nickname || ''}
            onChangeText={(value) => {
              setEditNickname(value);
              updateLocation(openLoc.id, { nickname: value.trim() || undefined });
            }}
            placeholder="e.g. Home gym"
          />
          <Pressable onPress={() => setHomeLocation(openLoc.id)}>
            <Text>{openLoc.isHome ? '●' : '○'} Set as home location</Text>
          </Pressable>
          <Text style={{ fontWeight: '600' }}>Difficulty levels</Text>
          {openLoc.levels.map((level, index) => (
            <LevelRow
              key={level.id}
              level={level}
              index={index}
              total={openLoc.levels.length}
              dragSourceId={dragSourceId}
              onUpdate={(patch) => updateLevel(openLoc.id, level.id, patch)}
              onMoveUp={() => moveLevel(openLoc.id, level.id, 'up')}
              onMoveDown={() => moveLevel(openLoc.id, level.id, 'down')}
              onRemove={() => removeLevel(openLoc.id, level.id)}
              onDragStart={(levelId) => setDragSourceId(levelId)}
              onDragTarget={(levelId) => {
                if (dragSourceId && dragSourceId !== levelId) {
                  swapLevels(openLoc.id, dragSourceId, levelId);
                  setDragSourceId(null);
                }
              }}
            />
          ))}
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <WireframeButton label="Add level" variant="secondary" onPress={() => addLevel(openLoc.id)} />
            <WireframeButton
              label={`Sort: ${openLoc.levelSort === 'easy-hard' ? 'Easy → Hard' : 'Hard → Easy'}`}
              variant="ghost"
              onPress={() => toggleLevelSort(openLoc.id)}
            />
          </View>
        </WireframeSection>
      ) : null}
    </View>
  );
}
