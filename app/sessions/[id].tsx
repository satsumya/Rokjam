import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ClimbAtGlance, ShareMockBanner } from '../../src/components/SessionClimb';
import {
  WireframeBox,
  WireframeBottomSheet,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../src/components/Wireframe';
import { usePrototype } from '../../src/context/PrototypeContext';
import { computeDurationMinutes, formatDuration, formatSessionDate } from '../../src/utils/sessionUtils';

export default function SessionDetailScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();
  const { sessions, deleteSession, seedDemoSessions } = usePrototype();
  const [shareVisible, setShareVisible] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const demoApplied = useRef(false);

  useEffect(() => {
    if (demo !== 'seed' || demoApplied.current) return;
    if (sessions.some((s) => s.id === id)) return;
    seedDemoSessions();
    demoApplied.current = true;
  }, [demo, id, seedDemoSessions, sessions]);

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
  const isCompleted = session.status === 'completed';

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
          {isCompleted ? (
            <WireframeButton label="Share session" variant="secondary" onPress={() => setShareVisible(true)} />
          ) : null}
          <WireframeButton
            label="Delete session"
            variant="ghost"
            onPress={() => setShowDeleteSheet(true)}
          />
          <WireframeLink label="Back to sessions" onPress={() => router.replace('/sessions')} />
        </>
      }
      overlay={
        <WireframeBottomSheet
          visible={showDeleteSheet}
          title="Delete session?"
          onClose={() => setShowDeleteSheet(false)}
        >
          <Text>This will permanently remove this session and all climbs in it.</Text>
          <WireframeButton
            label="Delete session"
            onPress={() => {
              deleteSession(session.id);
              router.replace('/sessions');
            }}
          />
          <WireframeButton label="Cancel" variant="ghost" onPress={() => setShowDeleteSheet(false)} />
        </WireframeBottomSheet>
      }
    >
      <ShareMockBanner visible={shareVisible} />

      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>{formatSessionDate(session.date)}</Text>
        <Text>{session.locationName || 'No location set'}</Text>
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
            <ClimbAtGlance
              key={climb.id}
              climb={climb}
              onShare={isCompleted ? () => setShareVisible(true) : undefined}
            />
          ))
        )}
      </WireframeSection>

    </WireframeScreen>
  );
}
