import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  BottomSheet,
  Button,
  Card,
  ClimbCard,
  Link,
  Screen,
  Section,
  ShareMockBanner,
} from '../../src/components';
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
      <Screen
        title="Session not found"
        footer={<Link label="Back to sessions" onPress={() => router.replace('/sessions')} />}
      >
        <Card>
          <Text>This session could not be found.</Text>
        </Card>
      </Screen>
    );
  }

  const duration = formatDuration(
    computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes),
  );
  const isCompleted = session.status === 'completed';

  return (
    <Screen
      title="Session details"
      footer={
        <>
          {session.status === 'active' ? (
            <Button
              label="Continue session"
              onPress={() => router.push(`/sessions/${session.id}/active`)}
            />
          ) : (
            <Button
              label="Edit session"
              onPress={() => router.push(`/sessions/${session.id}/edit`)}
            />
          )}
          {isCompleted ? (
            <Button label="Share session" variant="secondary" onPress={() => setShareVisible(true)} />
          ) : null}
          <Button
            label="Delete session"
            variant="ghost"
            onPress={() => setShowDeleteSheet(true)}
          />
          <Link label="Back to sessions" onPress={() => router.replace('/sessions')} />
        </>
      }
      overlay={
        <BottomSheet
          visible={showDeleteSheet}
          title="Delete session?"
          onClose={() => setShowDeleteSheet(false)}
        >
          <Text>This will permanently remove this session and all climbs in it.</Text>
          <Button
            label="Delete session"
            onPress={() => {
              deleteSession(session.id);
              router.replace('/sessions');
            }}
          />
          <Button label="Cancel" variant="ghost" onPress={() => setShowDeleteSheet(false)} />
        </BottomSheet>
      }
    >
      <ShareMockBanner visible={shareVisible} />

      <Card>
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
      </Card>

      <Section title="Climbs">
        {session.climbs.length === 0 ? (
          <Card>
            <Text>No climbs logged in this session.</Text>
          </Card>
        ) : (
          session.climbs.map((climb) => (
            <ClimbCard
              key={climb.id}
              climb={climb}
              onShare={isCompleted ? () => setShareVisible(true) : undefined}
            />
          ))
        )}
      </Section>

    </Screen>
  );
}
