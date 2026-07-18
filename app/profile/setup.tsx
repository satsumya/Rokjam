import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  AddressSearch,
  Avatar,
  BottomSheet,
  Button,
  Icon,
  LevelRow,
  Link,
  Modal,
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
import { getUsernameError, isUsernameAvailable } from '../../src/utils/validation';
import { locationHasGradedSessionClimbs } from '../../src/utils/sessionUtils';
import { space } from '../../src/theme/spacing';

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
    removeLocation,
    setHomeLocation,
    addLevel,
    removeLevel,
    moveLevel,
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
    sessions,
  } = usePrototype();

  const [openLocationId, setOpenLocationId] = useState<string | null>(null);
  const [locationError, setLocationError] = useState('');
  const [usernameDraft, setUsernameDraft] = useState(username);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [levelsNudgeLocationId, setLevelsNudgeLocationId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [levelImpactPending, setLevelImpactPending] = useState<null | {
    locationId: string;
    action: () => void;
  }>(null);
  const [levelImpactAcknowledged, setLevelImpactAcknowledged] = useState<Record<string, true>>({});
  const locationCountRef = useRef(locations.length);

  useEffect(() => {
    setUsernameDraft(username);
  }, [username]);

  useEffect(() => {
    if (demo === 'error-no-location') {
      setLocationError('Add at least one gym or climbing location');
    }
  }, [demo]);

  useEffect(() => {
    const previousCount = locationCountRef.current;
    locationCountRef.current = locations.length;
    // Open the first location when it is newly added; don't force-reopen if the user closes it.
    if (previousCount === 0 && locations.length === 1) {
      setOpenLocationId(locations[0].id);
    }
  }, [locations]);

  const usernameError = usernameTouched ? getUsernameError(usernameDraft, TAKEN_USERNAMES) : undefined;
  const usernameSuccess =
    usernameTouched && isUsernameAvailable(usernameDraft, TAKEN_USERNAMES)
      ? 'Username available'
      : undefined;
  const usernameDirty = usernameDraft.trim() !== username.trim();
  const canConfirmUsername = usernameDirty && !getUsernameError(usernameDraft, TAKEN_USERNAMES);
  const isEditingCompleteProfile = profileComplete;
  const deleteTarget = locations.find((loc) => loc.id === deleteTargetId);

  const confirmUsername = () => {
    if (!canConfirmUsername) return;
    setUsername(usernameDraft.trim());
    setUsernameTouched(false);
  };

  const handleAddLocation = (address: string) => {
    setLocationError('');
    const id = addLocation(address);
    setOpenLocationId(id);
    setLevelsNudgeLocationId(id);
  };

  const handleComplete = () => {
    if (locations.length === 0) {
      setLocationError('Add at least one gym or climbing location');
      return;
    }
    setUsernameTouched(true);
    if (getUsernameError(usernameDraft, TAKEN_USERNAMES)) return;
    // Completing the profile confirms any pending username draft.
    setUsername(usernameDraft.trim());
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

  const confirmDeleteLocation = () => {
    if (!deleteTargetId) return;
    const remaining = locations.filter((loc) => loc.id !== deleteTargetId);
    removeLocation(deleteTargetId);
    setDeleteTargetId(null);
    setOpenLocationId(remaining[0]?.id ?? null);
    if (remaining.length === 0) {
      setLocationError('');
    }
  };

  /** Gate level edits that would sync into past climbs — confirm once per location. */
  const runLevelEdit = (locationId: string, action: () => void) => {
    if (levelImpactAcknowledged[locationId] || !locationHasGradedSessionClimbs(sessions, locationId)) {
      action();
      return;
    }
    setLevelImpactPending({ locationId, action });
  };

  const confirmLevelImpact = () => {
    if (!levelImpactPending) return;
    const { locationId, action } = levelImpactPending;
    setLevelImpactAcknowledged((current) => ({ ...current, [locationId]: true }));
    setLevelImpactPending(null);
    action();
  };

  const cancelLevelImpact = () => setLevelImpactPending(null);

  return (
    <Screen
      title="Member profile"
      headerRight={
        <Button
          icon="close"
          variant="ghost"
          size="small"
          accessibilityLabel="Exit"
          onPress={handleExit}
        />
      }
      footer={
        isEditingCompleteProfile ? undefined : (
          <>
            <Button label="Complete profile" colorStyle="style1" onPress={handleComplete} />
            <Link label="Skip for now" onPress={handleExit} />
          </>
        )
      }
      overlay={
        <>
          <BottomSheet
            visible={Boolean(deleteTarget)}
            title="Delete location"
            onClose={() => setDeleteTargetId(null)}
          >
            <Text variant="body">
              {deleteTarget
                ? `Remove “${deleteTarget.name}” and its difficulty levels?`
                : 'Remove this location?'}
            </Text>
            <Button label="Delete location" onPress={confirmDeleteLocation} />
            <Button label="Cancel" variant="ghost" onPress={() => setDeleteTargetId(null)} />
          </BottomSheet>
          <Modal
            visible={Boolean(levelImpactPending)}
            title="Update past sessions?"
            onClose={cancelLevelImpact}
            footer={
              <>
                <Button label="Continue" colorStyle="style1" onPress={confirmLevelImpact} />
                <Button label="Cancel" variant="ghost" onPress={cancelLevelImpact} />
              </>
            }
          >
            <Text variant="body">
              Changing difficulty levels updates past climbing sessions at this location. If you
              don’t want to change past sessions, cancel and add a new location instead.
            </Text>
          </Modal>
        </>
      }
    >
      <Section title="Profile pic">
        <View style={{ flexDirection: 'row', gap: space[12], flexWrap: 'wrap' }}>
          {PET_ROCK_AVATARS.map((rock) => (
            <Pressable
              key={rock}
              onPress={() => setAvatar(rock)}
              style={{
                borderWidth: 1,
                borderColor: avatar === rock ? ui.borderStrong : ui.border,
                borderRadius: 8,
                padding: space[12],
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
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: space[8],
          }}
        >
          <View style={{ flexGrow: 1, flexBasis: 160, minWidth: 0 }}>
            <TextField
              value={usernameDraft}
              onChangeText={(value) => {
                setUsernameDraft(value);
                setUsernameTouched(true);
              }}
              placeholder="Choose a username"
              error={usernameError}
              success={usernameSuccess}
              onSubmitEditing={confirmUsername}
              returnKeyType="done"
              maxLength={20}
            />
          </View>
          {canConfirmUsername ? (
            <Button
              icon="check"
              colorStyle="style1"
              size="medium"
              accessibilityLabel="Confirm username"
              onPress={confirmUsername}
            />
          ) : null}
        </View>
      </Section>

      <Section title="Locations" required>
        {locations.map((location) => {
          const isOpen = openLocationId === location.id;
          return (
            <View
              key={location.id}
              style={{
                borderWidth: 1,
                borderColor: ui.border,
                borderRadius: 8,
                overflow: isOpen ? 'visible' : 'hidden',
                zIndex: isOpen ? 3 : 1,
              }}
            >
              <Pressable
                onPress={() => setOpenLocationId(isOpen ? null : location.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: space[12],
                  backgroundColor: ui.surfaceMuted,
                  gap: space[8],
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: isOpen ? 0 : 8,
                  borderBottomRightRadius: isOpen ? 0 : 8,
                }}
              >
                {location.isHome ? <Icon name="house" size="xs" color={ui.text} /> : null}
                <Text variant="body" weight="bold" style={{ flex: 1, minWidth: 0 }}>
                  {location.nickname?.trim() ? location.nickname.trim() : location.name}
                </Text>
                <Icon name={isOpen ? 'caretUp' : 'caretDown'} size="xs" color={ui.text} />
              </Pressable>

              {isOpen ? (
                <View style={{ padding: space[12], gap: space[12], backgroundColor: ui.surface }}>
                  <AddressSearch
                    initialValue={location.name}
                    clearOnSelect={false}
                    onSelect={(address) => updateLocation(location.id, { name: address })}
                  />
                  <TextField
                    label="Nickname"
                    value={location.nickname ?? ''}
                    onChangeText={(nickname) =>
                      updateLocation(location.id, {
                        nickname: nickname.length === 0 ? undefined : nickname,
                      })
                    }
                    placeholder="e.g. Home wall"
                  />
                  <View style={{ flexDirection: 'row', gap: space[8], flexWrap: 'wrap' }}>
                    {!location.isHome ? (
                      <Button
                        label="Set as home"
                        variant="secondary"
                        onPress={() => setHomeLocation(location.id)}
                      />
                    ) : null}
                    <Button
                      label="Delete location"
                      variant="ghost"
                      onPress={() => setDeleteTargetId(location.id)}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: space[8],
                    }}
                  >
                    <Text variant="body" weight="bold" style={{ flexShrink: 1, minWidth: 0 }}>
                      Difficulty levels
                    </Text>
                    <Button
                      label={location.levelSort === 'easy-hard' ? 'Easy → Hard' : 'Hard → Easy'}
                      variant="ghost"
                      onPress={() => runLevelEdit(location.id, () => toggleLevelSort(location.id))}
                    />
                  </View>

                  {levelsNudgeLocationId === location.id ? (
                    <Text variant="bodySmall" color={ui.textMuted}>
                      Add colour grades for this location so you can log climbs against them.
                    </Text>
                  ) : null}

                  {location.levels.map((level, index) => (
                    <LevelRow
                      key={level.id}
                      level={level}
                      index={index}
                      total={location.levels.length}
                      takenColors={location.levels
                        .filter((item) => item.id !== level.id)
                        .map((item) => item.color)}
                      onUpdate={(patch) =>
                        runLevelEdit(location.id, () => updateLevel(location.id, level.id, patch))
                      }
                      onMoveUp={() =>
                        runLevelEdit(location.id, () => moveLevel(location.id, level.id, 'up'))
                      }
                      onMoveDown={() =>
                        runLevelEdit(location.id, () => moveLevel(location.id, level.id, 'down'))
                      }
                      onRemove={() =>
                        runLevelEdit(location.id, () => removeLevel(location.id, level.id))
                      }
                      onReorder={(fromIndex, toIndex) => {
                        runLevelEdit(location.id, () => {
                          const next = [...location.levels];
                          const [moved] = next.splice(fromIndex, 1);
                          next.splice(toIndex, 0, moved);
                          updateLocation(location.id, { levels: next });
                        });
                      }}
                    />
                  ))}

                  <Button
                    label="Add level"
                    variant="secondary"
                    onPress={() => {
                      runLevelEdit(location.id, () => {
                        addLevel(location.id);
                        setLevelsNudgeLocationId(null);
                      });
                    }}
                  />
                </View>
              ) : null}
            </View>
          );
        })}

        <AddressSearch label={false} onSelect={handleAddLocation} error={locationError} />
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
