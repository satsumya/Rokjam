import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ClimbEditor } from '../../../src/components/SessionClimb';
import { SessionClimbsList } from '../../../src/components/SessionClimbsList';
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
import { formatSessionDate } from '../../../src/utils/sessionUtils';

const emptyClimb = (): SessionClimb => ({
  id: 'draft',
  tags: [],
  hasImage: false,
  hasVideo: false,
  isWarmUp: false,
  isRepeat: false,
  attempts: [{ id: 'draft-a', progress: [] }],
});

export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions, locations, username, updateSession, updateClimb, removeClimb, addClimb } =
    usePrototype();

  const session = sessions.find((s) => s.id === id);
  const location = locations.find((l) => l.id === session?.locationId);

  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);
  const [draftClimb, setDraftClimb] = useState<SessionClimb | null>(null);
  const [isPublic, setIsPublic] = useState(session?.isPublic ?? false);
  const [publicError, setPublicError] = useState('');

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
        <Text style={{ fontWeight: '600' }}>{formatSessionDate(session.date)}</Text>
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
        {publicError ? <Text style={{ color: '#C0392B' }}>{publicError}</Text> : null}
      </WireframeSection>

      <WireframeSection title="Climbs">
        {!draftClimb ? (
          <WireframeButton
            label="Add climb"
            variant="secondary"
            onPress={() => {
              setEditingClimbId('new');
              setDraftClimb(emptyClimb());
            }}
          />
        ) : null}

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
          <>
            <SessionClimbsList
              climbs={session.climbs}
              location={location}
              onEditClimb={(climb) => {
                setEditingClimbId(climb.id);
                setDraftClimb({ ...climb });
              }}
            />
            {!editingClimbId
              ? session.climbs.map((climb) => (
                  <WireframeButton
                    key={`remove-${climb.id}`}
                    label={`Remove ${climb.name || 'climb'}`}
                    variant="ghost"
                    onPress={() => removeClimb(session.id, climb.id)}
                  />
                ))
              : null}
          </>
        )}
      </WireframeSection>
    </WireframeScreen>
  );
}
