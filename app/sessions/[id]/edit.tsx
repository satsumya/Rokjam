import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ClimbAtGlance, ClimbEditor } from '../../../src/components/SessionClimb';
import {
  WireframeBox,
  WireframeButton,
  WireframeField,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../../src/components/Wireframe';
import { usePrototype } from '../../../src/context/PrototypeContext';
import type { SessionClimb } from '../../../src/types/climbingSession';

export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions, locations, username, setUsername, updateSession, updateClimb, removeClimb } =
    usePrototype();

  const session = sessions.find((s) => s.id === id);
  const location = locations.find((l) => l.id === session?.locationId);

  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);
  const [draftClimb, setDraftClimb] = useState<SessionClimb | null>(null);
  const [isPublic, setIsPublic] = useState(session?.isPublic ?? false);
  const [usernameInput, setUsernameInput] = useState(session?.ownerUsername || username);
  const [usernameError, setUsernameError] = useState('');

  if (!session || session.status !== 'completed') {
    return (
      <WireframeScreen
        title="Cannot edit"
        footer={<WireframeLink label="Back" onPress={() => router.back()} />}
      >
        <WireframeBox>
          <Text>Only completed sessions can be edited here.</Text>
        </WireframeBox>
      </WireframeScreen>
    );
  }

  const saveSession = () => {
    if (isPublic && !usernameInput.trim()) {
      setUsernameError('Username required for public sessions');
      return;
    }
    if (isPublic) setUsername(usernameInput.trim());
    updateSession(session.id, {
      isPublic,
      ownerUsername: usernameInput.trim() || username,
    });
    router.replace(`/sessions/${session.id}`);
  };

  const saveClimb = () => {
    if (!draftClimb || !editingClimbId) return;
    updateClimb(session.id, editingClimbId, draftClimb);
    setEditingClimbId(null);
    setDraftClimb(null);
  };

  return (
    <WireframeScreen
      title="Edit session"
      footer={
        <>
          <WireframeButton label="Save changes" onPress={saveSession} />
          <WireframeLink label="Cancel" onPress={() => router.back()} />
        </>
      }
    >
      <WireframeSection title="Session">
        <WireframeField
          label="Date"
          value={session.date}
          onChangeText={(date) => updateSession(session.id, { date })}
        />
        <WireframeField
          label="Start time"
          value={session.startTime}
          onChangeText={(startTime) => updateSession(session.id, { startTime })}
        />
        <WireframeField
          label="End time"
          value={session.endTime ?? ''}
          onChangeText={(endTime) => updateSession(session.id, { endTime })}
        />
        <View style={{ gap: 4 }}>
          <Pressable onPress={() => setIsPublic(false)}>
            <Text>{!isPublic ? '●' : '○'} Private</Text>
          </Pressable>
          <Pressable onPress={() => setIsPublic(true)}>
            <Text>{isPublic ? '●' : '○'} Public</Text>
          </Pressable>
        </View>
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
          />
        ) : null}
      </WireframeSection>

      <WireframeSection title="Climbs">
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
          />
        ) : (
          session.climbs.map((climb) => (
            <View key={climb.id} style={{ gap: 8 }}>
              <ClimbAtGlance climb={climb} onPress={() => {
                setEditingClimbId(climb.id);
                setDraftClimb({ ...climb });
              }} />
              <WireframeButton
                label="Remove climb"
                variant="ghost"
                onPress={() => removeClimb(session.id, climb.id)}
              />
            </View>
          ))
        )}
      </WireframeSection>
    </WireframeScreen>
  );
}
