import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  ClimbAtGlance,
  ClimbEditor,
  ShareMockBanner,
} from '../../../src/components/SessionClimb';
import {
  WireframeBox,
  WireframeButton,
  WireframeField,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../../src/components/Wireframe';
import { usePrototype } from '../../../src/context/PrototypeContext';
import type { SessionClimb, SessionSort } from '../../../src/types/climbingSession';
import { CLIMB_TAG_SUGGESTIONS } from '../../../src/types/climbingSession';
import {
  computeDurationMinutes,
  filterClimbs,
  nowTimeLabel,
  sortClimbs,
} from '../../../src/utils/sessionUtils';

const emptyClimb = (): SessionClimb => ({
  id: 'draft',
  tags: [],
  hasImage: false,
  hasVideo: false,
  isWarmUp: false,
  isRepeat: false,
  attempts: [{ id: 'draft-a', progress: [] }],
});

export default function ActiveSessionScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();
  const {
    sessions,
    locations,
    username,
    setUsername,
    updateSession,
    completeSession,
    addClimb,
    updateClimb,
    removeClimb,
    addLocation,
  } = usePrototype();

  const session = sessions.find((s) => s.id === id);
  const location = locations.find((l) => l.id === session?.locationId) ?? locations[0];

  const [sort, setSort] = useState<SessionSort>('order');
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [hideWarmUp, setHideWarmUp] = useState(false);
  const [hideRepeat, setHideRepeat] = useState(false);
  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);
  const [draftClimb, setDraftClimb] = useState<SessionClimb | null>(null);
  const [showEndPanel, setShowEndPanel] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [usernameInput, setUsernameInput] = useState(username);
  const [usernameError, setUsernameError] = useState('');
  const [shareVisible, setShareVisible] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');

  const filteredClimbs = useMemo(() => {
    if (!session) return [];
    const sorted = sortClimbs(session.climbs, sort, location?.levels ?? []);
    return filterClimbs(sorted, {
      search,
      difficultyId: filterDifficulty || undefined,
      tag: filterTag || undefined,
      hideWarmUp,
      hideRepeat,
    });
  }, [session, sort, location, search, filterDifficulty, filterTag, hideWarmUp, hideRepeat]);

  if (!session) {
    return (
      <WireframeScreen
        title="Session not found"
        footer={<WireframeLink label="Back to dashboard" onPress={() => router.replace('/dashboard')} />}
      >
        <WireframeBox>
          <Text>This session could not be found.</Text>
        </WireframeBox>
      </WireframeScreen>
    );
  }

  const startEdit = (climb: SessionClimb) => {
    setEditingClimbId(climb.id);
    setDraftClimb({ ...climb });
  };

  const startAdd = () => {
    setEditingClimbId('new');
    setDraftClimb(emptyClimb());
  };

  const saveClimb = () => {
    if (!draftClimb) return;
    if (editingClimbId === 'new') {
      const { id: _id, ...rest } = draftClimb;
      addClimb(session.id, rest);
    } else if (editingClimbId) {
      updateClimb(session.id, editingClimbId, draftClimb);
    }
    setEditingClimbId(null);
    setDraftClimb(null);
  };

  const endSession = () => {
    if (isPublic && !usernameInput.trim()) {
      setUsernameError('Username required for public sessions');
      return;
    }
    if (isPublic && usernameInput.trim()) {
      setUsername(usernameInput.trim());
    }
    const resolvedEnd = endTime || nowTimeLabel();
    const duration = durationInput
      ? Number(durationInput)
      : computeDurationMinutes(session.startTime, resolvedEnd);
    completeSession(session.id, {
      endTime: resolvedEnd,
      durationMinutes: duration,
      isPublic,
      ownerUsername: usernameInput.trim() || username,
    });
    router.replace(`/sessions/${session.id}`);
  };

  const addLocationNow = () => {
    if (!newLocationName.trim()) return;
    const locId = addLocation(newLocationName.trim());
    updateSession(session.id, {
      locationId: locId,
      locationName: newLocationName.trim(),
    });
    setNewLocationName('');
  };

  return (
    <WireframeScreen
      title="Climbing session"
      footer={
        <>
          <WireframeButton label="Add climb" onPress={startAdd} />
          <WireframeButton
            label="Save / end session"
            variant="secondary"
            onPress={() => setShowEndPanel(true)}
          />
          <WireframeButton
            label="Share session"
            variant="ghost"
            onPress={() => setShareVisible(true)}
          />
        </>
      }
    >
      <ShareMockBanner visible={shareVisible} />

      <WireframeSection title="Session details">
        <WireframeField
          label="Date"
          value={session.date}
          onChangeText={(date) => updateSession(session.id, { date })}
        />
        {locations.length === 0 || demo === 'no-location' ? (
          <WireframeBox>
            <Text style={{ fontWeight: '700' }}>No location on profile</Text>
            <Text>Add a location now to log climbs with difficulty levels.</Text>
            <WireframeField
              label="Location name"
              value={newLocationName}
              onChangeText={setNewLocationName}
              placeholder="Search or enter gym name"
              required
            />
            <WireframeButton label="Add location now" onPress={addLocationNow} />
          </WireframeBox>
        ) : (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: '600' }}>Location</Text>
            {locations.map((loc) => (
              <Pressable
                key={loc.id}
                onPress={() =>
                  updateSession(session.id, { locationId: loc.id, locationName: loc.name })
                }
              >
                <Text style={{ fontWeight: session.locationId === loc.id ? '700' : '400' }}>
                  {loc.isHome ? '🏠 ' : ''}
                  {loc.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        <WireframeField
          label="Start time"
          value={session.startTime}
          onChangeText={(startTime) => updateSession(session.id, { startTime })}
        />
        <WireframeField
          label="End time (optional)"
          value={endTime}
          onChangeText={setEndTime}
          placeholder="HH:MM — or set duration below"
        />
        <WireframeField
          label="Session duration (minutes, optional)"
          value={durationInput}
          onChangeText={setDurationInput}
          keyboardType="number-pad"
          placeholder="e.g. 90"
        />
      </WireframeSection>

      {draftClimb && editingClimbId ? (
        <ClimbEditor
          climb={draftClimb}
          location={location}
          onChange={(patch) => setDraftClimb((c) => (c ? { ...c, ...patch } : c))}
          onSave={saveClimb}
          onCancel={() => {
            setEditingClimbId(null);
            setDraftClimb(null);
          }}
          onShare={() => setShareVisible(true)}
        />
      ) : (
        <>
          <WireframeSection title="Climbs">
            <WireframeField
              label="Search climbs"
              value={search}
              onChangeText={setSearch}
              placeholder="Name, tag, notes…"
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Text style={{ fontWeight: '600' }}>Sort:</Text>
              {(
                [
                  ['order', 'Order added'],
                  ['difficulty', 'Difficulty'],
                  ['name', 'Name'],
                ] as const
              ).map(([value, label]) => (
                <Pressable key={value} onPress={() => setSort(value)}>
                  <Text style={{ fontWeight: sort === value ? '700' : '400' }}>{label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ gap: 4 }}>
              <Text style={{ fontWeight: '600' }}>Filter</Text>
              {location?.levels.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  <Pressable onPress={() => setFilterDifficulty('')}>
                    <Text>All difficulties</Text>
                  </Pressable>
                  {location.levels.map((level) => (
                    <Pressable key={level.id} onPress={() => setFilterDifficulty(level.id)}>
                      <Text style={{ fontWeight: filterDifficulty === level.id ? '700' : '400' }}>
                        {level.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              <Pressable onPress={() => setHideWarmUp((v) => !v)}>
                <Text>{hideWarmUp ? '☑' : '☐'} Hide warm-up climbs</Text>
              </Pressable>
              <Pressable onPress={() => setHideRepeat((v) => !v)}>
                <Text>{hideRepeat ? '☑' : '☐'} Hide repeat climbs</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <Pressable onPress={() => setFilterTag('')}>
                  <Text>All tags</Text>
                </Pressable>
                {CLIMB_TAG_SUGGESTIONS.map((tag) => (
                  <Pressable key={tag} onPress={() => setFilterTag(tag)}>
                    <Text style={{ fontWeight: filterTag === tag ? '700' : '400' }}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {filteredClimbs.length === 0 ? (
              <WireframeBox>
                <Text>No climbs yet. Tap Add climb to log your first climb.</Text>
              </WireframeBox>
            ) : (
              filteredClimbs.map((climb) => (
                <ClimbAtGlance
                  key={climb.id}
                  climb={climb}
                  onPress={() => startEdit(climb)}
                  onShare={() => setShareVisible(true)}
                />
              ))
            )}
          </WireframeSection>
        </>
      )}

      {showEndPanel ? (
        <WireframeBox>
          <Text style={{ fontWeight: '700' }}>End session</Text>
          <Pressable onPress={() => setIsPublic(false)}>
            <Text>{!isPublic ? '●' : '○'} Private (default)</Text>
          </Pressable>
          <Pressable onPress={() => setIsPublic(true)}>
            <Text>{isPublic ? '●' : '○'} Public</Text>
          </Pressable>
          {isPublic ? (
            <WireframeField
              label="Username"
              value={usernameInput}
              onChangeText={(v) => {
                setUsernameInput(v);
                setUsernameError('');
              }}
              error={usernameError}
              required
              placeholder="Required for public sessions"
            />
          ) : null}
          <Text style={{ color: '#666', fontSize: 13 }}>
            End time will be {endTime || nowTimeLabel()} unless you set one above.
          </Text>
          <WireframeButton label="Confirm and save session" onPress={endSession} />
          <WireframeButton label="Cancel" variant="ghost" onPress={() => setShowEndPanel(false)} />
        </WireframeBox>
      ) : null}
    </WireframeScreen>
  );
}
