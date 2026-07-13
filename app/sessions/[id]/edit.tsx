import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  BottomSheet,
  Button,
  Card,
  ClimbEditor,
  Link,
  Screen,
  Section,
  SessionClimbsList,
  SessionTimeDropdown,
  TextField,
} from '../../../src/components';
import { usePrototype } from '../../../src/context/PrototypeContext';
import { ui } from '../../../src/theme/colors';
import type { SessionClimb } from '../../../src/types/climbingSession';
import { climbHasDetails, formatSessionDate } from '../../../src/utils/sessionUtils';

const emptyClimb = (): SessionClimb => ({
  id: 'draft',
  tags: [],
  hasImage: false,
  hasVideo: false,
  isWarmUp: false,
  isRepeat: false,
  isProject: false,
  attempts: [{ id: 'draft-a', progress: [] }],
});

export default function EditSessionScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();
  const { sessions, locations, username, updateSession, updateClimb, removeClimb, addClimb, seedDemoSessions } =
    usePrototype();
  const demoApplied = useRef(false);

  useEffect(() => {
    if (demo !== 'seed' || demoApplied.current) return;
    if (sessions.some((s) => s.id === id)) return;
    seedDemoSessions();
    demoApplied.current = true;
  }, [demo, id, seedDemoSessions, sessions]);

  const session = sessions.find((s) => s.id === id);
  const location = locations.find((l) => l.id === session?.locationId);

  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);
  const [draftClimb, setDraftClimb] = useState<SessionClimb | null>(null);
  const [isPublic, setIsPublic] = useState(session?.isPublic ?? false);
  const [publicError, setPublicError] = useState('');
  const [removeTarget, setRemoveTarget] = useState<SessionClimb | null>(null);

  if (!session || session.status !== 'completed') {
    return (
      <Screen
        title="Cannot edit"
        footer={<Link label="Back" onPress={() => router.back()} />}
      >
        <Card>
          <Text>Only completed sessions can be edited here.</Text>
        </Card>
      </Screen>
    );
  }

  const saveSession = () => {
    if (isPublic && !username.trim()) {
      setPublicError('Set your username in member profile to share sessions publicly.');
      return;
    }
    setPublicError('');
    updateSession(session.id, {
      isPublic,
      ownerUsername: username.trim() || session.ownerUsername,
    });
    router.replace(`/sessions/${session.id}`);
  };

  const saveClimb = () => {
    if (!draftClimb || !editingClimbId) return;
    if (editingClimbId === 'new') {
      const { id: _id, ...rest } = draftClimb;
      addClimb(session.id, rest);
    } else {
      updateClimb(session.id, editingClimbId, draftClimb);
    }
    setEditingClimbId(null);
    setDraftClimb(null);
  };

  const handleRemoveClimb = (climb: SessionClimb) => {
    if (climbHasDetails(climb)) {
      setRemoveTarget(climb);
      return;
    }
    removeClimb(session.id, climb.id);
  };

  const confirmRemoveClimb = () => {
    if (removeTarget) {
      removeClimb(session.id, removeTarget.id);
    }
    setRemoveTarget(null);
  };

  return (
    <Screen
      title="Edit session"
      footer={
        <>
          <Button label="Save changes" onPress={saveSession} />
          <Link label="Cancel" onPress={() => router.back()} />
        </>
      }
      overlay={
        <BottomSheet
          visible={Boolean(removeTarget)}
          title="Remove climb?"
          onClose={() => setRemoveTarget(null)}
        >
          <Text>
            {removeTarget?.name?.trim()
              ? `"${removeTarget.name}" has details that will be lost.`
              : 'This climb has details that will be lost.'}
          </Text>
          <Button label="Remove climb" onPress={confirmRemoveClimb} />
          <Button label="Cancel" variant="ghost" onPress={() => setRemoveTarget(null)} />
        </BottomSheet>
      }
    >
      <Section title="Session">
        <Text style={{ fontWeight: '600' }}>{formatSessionDate(session.date)}</Text>
        <TextField
          label="Date"
          value={session.date}
          onChangeText={(date) => updateSession(session.id, { date })}
        />
        <SessionTimeDropdown
          label="Start time"
          value={session.startTime}
          onChange={(startTime) => updateSession(session.id, { startTime })}
        />
        <SessionTimeDropdown
          label="End time"
          value={session.endTime ?? ''}
          onChange={(endTime) => updateSession(session.id, { endTime })}
        />
        <View style={{ gap: 4 }}>
          <Pressable onPress={() => setIsPublic(false)}>
            <Text>{!isPublic ? '●' : '○'} Private</Text>
          </Pressable>
          <Pressable onPress={() => setIsPublic(true)}>
            <Text>{isPublic ? '●' : '○'} Public</Text>
          </Pressable>
        </View>
        {publicError ? <Text style={{ color: ui.danger }}>{publicError}</Text> : null}
      </Section>

      <Section title="Climbs">
        {!draftClimb ? (
          <Button
            label="Add climb"
            variant="secondary"
            onPress={() => {
              setEditingClimbId('new');
              setDraftClimb(emptyClimb());
            }}
          />
        ) : (
          <>
            <ClimbEditor
              climb={draftClimb}
              location={location}
              onChange={(patch) => setDraftClimb((c) => (c ? { ...c, ...patch } : c))}
            />
            <Button label="Save climb" onPress={saveClimb} />
            <Button
              label="Cancel"
              variant="ghost"
              onPress={() => {
                setEditingClimbId(null);
                setDraftClimb(null);
              }}
            />
          </>
        )}

        {!draftClimb ? (
          <SessionClimbsList
            climbs={session.climbs}
            location={location}
            onEditClimb={(climb) => {
              setEditingClimbId(climb.id);
              setDraftClimb({ ...climb });
            }}
            onRemoveClimb={handleRemoveClimb}
            onDifficultyChange={(climb, level) =>
              updateClimb(session.id, climb.id, {
                levelId: level.id,
                levelName: level.name,
                levelColor: level.color,
              })
            }
          />
        ) : null}
      </Section>
    </Screen>
  );
}
