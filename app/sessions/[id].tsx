import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ClimbAtGlance, ShareMockBanner } from '../../src/components/SessionClimb';
import {
  WireframeBox,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../src/components/Wireframe';
import { usePrototype } from '../../src/context/PrototypeContext';
import { computeDurationMinutes, formatDuration } from '../../src/utils/sessionUtils';
import { useState } from 'react';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions, locations, deleteSession } = usePrototype();
  const [shareVisible, setShareVisible] = useState(false);

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <WireframeScreen
        title="Session not found"
        footer={<WireframeLink label="Back to sessions" onPress={() => router.replace('/sessions')} />}
      >
        <WireframeBox>
          <Text>This session could not be found.</Text>
        </WireframeBox>
      </WireframeScreen>
    );
  }

  const duration = formatDuration(
    computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes),
  );

  return (
    <WireframeScreen
      title="Session details"
      footer={
        <>
          {session.status === 'active' ? (
            <WireframeButton
              label="Continue session"
              onPress={() => router.push(`/sessions/${session.id}/active`)}
            />
          ) : (
            <WireframeButton
              label="Edit session"
              onPress={() => router.push(`/sessions/${session.id}/edit`)}
            />
          )}
          <WireframeButton label="Share session" variant="secondary" onPress={() => setShareVisible(true)} />
          <WireframeButton
            label="Delete session"
            variant="ghost"
            onPress={() => {
              deleteSession(session.id);
              router.replace('/sessions');
            }}
          />
          <WireframeLink label="Back to sessions" onPress={() => router.replace('/sessions')} />
        </>
      }
    >
      <ShareMockBanner visible={shareVisible} />

      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>{session.date}</Text>
        <Text>{session.locationName}</Text>
        <Text>
          {session.startTime}
          {session.endTime ? ` – ${session.endTime}` : ''} ({duration})
        </Text>
        <Text>
          {session.climbs.length} climb{session.climbs.length === 1 ? '' : 's'} ·{' '}
          {session.isPublic ? 'Public' : 'Private'}
        </Text>
      </WireframeBox>

      <WireframeSection title="Climbs">
        {session.climbs.length === 0 ? (
          <WireframeBox>
            <Text>No climbs logged in this session.</Text>
          </WireframeBox>
        ) : (
          session.climbs.map((climb) => (
            <ClimbAtGlance key={climb.id} climb={climb} onShare={() => setShareVisible(true)} />
          ))
        )}
      </WireframeSection>
    </WireframeScreen>
  );
}
