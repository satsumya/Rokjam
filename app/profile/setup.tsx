import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  AddressSearch,
  Avatar,
  Button,
  Card,
  Icon,
  LevelRow,
  Link,
  Screen,
  Section,
  TagInput,
  Text,
  TextField,
} from '../../src/components';
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
    <Screen
      title="Member profile"
      headerRight={
        <Pressable onPress={handleExit}>
          <Text variant="body" style={{ textDecorationLine: 'underline' }}>
            Exit
          </Text>
        </Pressable>
      }
      footer={
        <>
          <Button
            label={isEditingCompleteProfile ? 'Save changes' : 'Complete profile'}
            onPress={handleComplete}
          />
          {!isEditingCompleteProfile ? (
            <Link label="Skip for now" onPress={handleExit} />
          ) : null}
        </>
      }
    >
      <Section title="Profile pic">
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
              <Avatar emoji={rock} size="lg" />
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title="Username">
        <TextField
          label="Username"
          value={username}
          onChangeText={(value) => {
            setUsername(value);
            setUsernameTouched(true);
          }}
          placeholder="Choose a username"
          error={usernameError}
        />
      </Section>

      <Section title="Locations">
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
                {location.isHome ? <Icon name="house" size="xs" color={ui.text} /> : null}
                <Text variant="body" weight="bold" style={{ flex: 1 }}>
                  {location.name}
                </Text>
                <Icon name={isOpen ? 'caretUp' : 'caretDown'} size="xs" color={ui.text} />
              </Pressable>

              {isOpen ? (
                <View style={{ padding: 12, gap: 12, backgroundColor: ui.surface }}>
                  {editingLocationId === location.id ? (
                    <View style={{ gap: 8 }}>
                      <TextField
                        label="Location"
                        required
                        value={editName}
                        onChangeText={setEditName}
                      />
                      <TextField
                        label="Nickname"
                        value={editNickname}
                        onChangeText={setEditNickname}
                        placeholder="e.g. Home wall"
                      />
                      <Button
                        label="Save location"
                        variant="secondary"
                        onPress={() => saveEditLocation(location.id)}
                      />
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      {location.nickname ? (
                        <Text variant="body">Nickname: {location.nickname}</Text>
                      ) : null}
                      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                        <Button
                          label="Edit location"
                          variant="secondary"
                          onPress={() =>
                            startEditLocation(location.id, location.name, location.nickname)
                          }
                        />
                        {!location.isHome ? (
                          <Button
                            label="Set as home"
                            variant="secondary"
                            onPress={() => setHomeLocation(location.id)}
                          />
                        ) : null}
                      </View>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text variant="body" weight="bold">
                      Difficulty levels
                    </Text>
                    <Button
                      label={location.levelSort === 'easy-hard' ? 'Easy → Hard' : 'Hard → Easy'}
                      variant="ghost"
                      onPress={() => toggleLevelSort(location.id)}
                    />
                  </View>

                  {levelsNudgeLocationId === location.id ? (
                    <Card>
                      <Text variant="body" weight="bold">
                        Add difficulty levels for this location
                      </Text>
                      <Text variant="body">
                        Levels help when logging climbs. Adjust the default level or add more to match your
                        gym&apos;s grading.
                      </Text>
                    </Card>
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

                  <Button
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
      </Section>

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
    </Screen>
  );
}
