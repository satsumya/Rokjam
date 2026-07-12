import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AddressSearch } from '../../src/components/AddressSearch';
import { LevelRow } from '../../src/components/LevelRow';
import { TagInput } from '../../src/components/TagInput';
import {
  WireframeButton,
  WireframeField,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
  WireframeBox,
} from '../../src/components/Wireframe';
import { ui } from '../../src/theme/colors';
import {
  IMPROVEMENT_TAG_SUGGESTIONS,
  STRENGTH_TAG_SUGGESTIONS,
  TAKEN_USERNAMES,
} from '../../src/constants/mockData';
import { PET_ROCK_AVATARS } from '../../src/constants/difficultyLevels';
import { usePrototype } from '../../src/context/PrototypeContext';
import { getUsernameError } from '../../src/utils/validation';

export default function ProfileSetupScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const {
    username,
    setUsername,
    avatar,
    setAvatar,
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
    strengthTags,
    improvementTags,
    addStrengthTag,
    removeStrengthTag,
    addImprovementTag,
    removeImprovementTag,
    setProfileComplete,
    setProfileSkipped,
    profileComplete,
  } = usePrototype();

  const [openLocationId, setOpenLocationId] = useState<string | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [locationError, setLocationError] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [dragSourceId, setDragSourceId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [levelsNudgeLocationId, setLevelsNudgeLocationId] = useState<string | null>(null);

  useEffect(() => {
    if (demo === 'error-no-location') {
      setLocationError('Add at least one gym or climbing location');
    }
  }, [demo]);

  useEffect(() => {
    if (locations.length === 1 && !openLocationId) {
      setOpenLocationId(locations[0].id);
    }
  }, [locations, openLocationId]);

  const usernameError = usernameTouched ? getUsernameError(username, TAKEN_USERNAMES) : undefined;
  const isEditingCompleteProfile = profileComplete;

  const handleAddLocation = (address: string) => {
    setLocationError('');
    const id = addLocation(address);
    setOpenLocationId(id);
    setEditingLocationId(null);
    setLevelsNudgeLocationId(id);
  };

  const handleComplete = () => {
    if (locations.length === 0) {
      setLocationError('Add at least one gym or climbing location');
      return;
    }
    if (usernameError) return;
    setProfileComplete(true);
    setProfileSkipped(false);
    router.replace('/dashboard');
  };

  const handleExit = () => {
    if (isEditingCompleteProfile) {
      router.replace('/dashboard');
      return;
    }
    setProfileSkipped(true);
    router.replace('/dashboard');
  };

  const startEditLocation = (id: string, name: string, nickname?: string) => {
    setEditingLocationId(id);
    setEditName(name);
    setEditNickname(nickname ?? '');
  };

  const saveEditLocation = (id: string) => {
    updateLocation(id, {
      name: editName.trim() || locations.find((loc) => loc.id === id)?.name,
      nickname: editNickname.trim() || undefined,
    });
    setEditingLocationId(null);
  };

  return (
    <WireframeScreen
      title="Member profile"
      headerRight={
        <Pressable onPress={handleExit}>
          <Text style={{ fontSize: 15, textDecorationLine: 'underline' }}>Exit</Text>
        </Pressable>
      }
      footer={
        <>
          <WireframeButton
            label={isEditingCompleteProfile ? 'Save changes' : 'Complete profile'}
            onPress={handleComplete}
          />
          {!isEditingCompleteProfile ? (
            <WireframeLink label="Skip for now" onPress={handleExit} />
          ) : null}
        </>
      }
    >
      <WireframeSection title="Profile pic">
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          {PET_ROCK_AVATARS.map((rock) => (
            <Pressable
              key={rock}
              onPress={() => setAvatar(rock)}
              style={{
                borderWidth: 1,
                borderColor: avatar === rock ? ui.borderStrong : ui.border,
                borderRadius: 8,
                padding: 12,
                minWidth: 56,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 28 }}>{rock}</Text>
            </Pressable>
          ))}
        </View>
      </WireframeSection>

      <WireframeSection title="Username">
        <WireframeField
          label="Username"
          value={username}
          onChangeText={(value) => {
            setUsername(value);
            setUsernameTouched(true);
          }}
          placeholder="Choose a username"
          error={usernameError}
        />
      </WireframeSection>

      <WireframeSection title="Locations">
        <AddressSearch onSelect={handleAddLocation} error={locationError} />

        {locations.map((location) => {
          const isOpen = openLocationId === location.id;
          return (
            <View
              key={location.id}
              style={{
                borderWidth: 1,
                borderColor: ui.border,
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Pressable
                onPress={() => setOpenLocationId(isOpen ? null : location.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  backgroundColor: ui.surfaceMuted,
                  gap: 8,
                }}
              >
                {location.isHome ? <Text>🏠</Text> : null}
                <Text style={{ flex: 1, fontWeight: '700' }}>{location.name}</Text>
                <Text>{isOpen ? '▲' : '▼'}</Text>
              </Pressable>

              {isOpen ? (
                <View style={{ padding: 12, gap: 12, backgroundColor: ui.surface }}>
                  {editingLocationId === location.id ? (
                    <View style={{ gap: 8 }}>
                      <WireframeField
                        label="Location"
                        required
                        value={editName}
                        onChangeText={setEditName}
                      />
                      <WireframeField
                        label="Nickname"
                        value={editNickname}
                        onChangeText={setEditNickname}
                        placeholder="e.g. Home wall"
                      />
                      <WireframeButton
                        label="Save location"
                        variant="secondary"
                        onPress={() => saveEditLocation(location.id)}
                      />
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      {location.nickname ? <Text>Nickname: {location.nickname}</Text> : null}
                      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                        <WireframeButton
                          label="Edit location"
                          variant="secondary"
                          onPress={() =>
                            startEditLocation(location.id, location.name, location.nickname)
                          }
                        />
                        {!location.isHome ? (
                          <WireframeButton
                            label="Set as home"
                            variant="secondary"
                            onPress={() => setHomeLocation(location.id)}
                          />
                        ) : null}
                      </View>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '700' }}>Difficulty levels</Text>
                    <WireframeButton
                      label={location.levelSort === 'easy-hard' ? 'Easy → Hard' : 'Hard → Easy'}
                      variant="ghost"
                      onPress={() => toggleLevelSort(location.id)}
                    />
                  </View>

                  {levelsNudgeLocationId === location.id ? (
                    <WireframeBox>
                      <Text style={{ fontWeight: '600' }}>Add difficulty levels for this location</Text>
                      <Text>
                        Levels help when logging climbs. Adjust the default level or add more to match your
                        gym&apos;s grading.
                      </Text>
                    </WireframeBox>
                  ) : null}

                  {location.levels.map((level, index) => (
                    <LevelRow
                      key={level.id}
                      level={level}
                      index={index}
                      total={location.levels.length}
                      dragSourceId={dragSourceId}
                      onUpdate={(patch) => updateLevel(location.id, level.id, patch)}
                      onMoveUp={() => moveLevel(location.id, level.id, 'up')}
                      onMoveDown={() => moveLevel(location.id, level.id, 'down')}
                      onRemove={() => removeLevel(location.id, level.id)}
                      onDragStart={(id) => setDragSourceId(id)}
                      onDragTarget={(id) => {
                        if (dragSourceId && dragSourceId !== id) {
                          swapLevels(location.id, dragSourceId, id);
                        }
                        setDragSourceId(null);
                      }}
                    />
                  ))}

                  <WireframeButton
                    label="Add level"
                    variant="secondary"
                    onPress={() => {
                      addLevel(location.id);
                      setLevelsNudgeLocationId(null);
                    }}
                  />
                </View>
              ) : null}
            </View>
          );
        })}
      </WireframeSection>

      <TagInput
        label="Strengths"
        tags={strengthTags}
        suggestions={STRENGTH_TAG_SUGGESTIONS}
        onAdd={addStrengthTag}
        onRemove={removeStrengthTag}
      />

      <TagInput
        label="Areas to improve"
        tags={improvementTags}
        suggestions={IMPROVEMENT_TAG_SUGGESTIONS}
        onAdd={addImprovementTag}
        onRemove={removeImprovementTag}
      />
    </WireframeScreen>
  );
}
