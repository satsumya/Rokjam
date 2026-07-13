import { useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  Button,
  Card,
  Link,
  PrototypeOnly,
  Screen,
  Section,
  SessionRow,
  Text,
} from '../../src/components';
import { usePrototype } from '../../src/context/PrototypeContext';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../../src/utils/sessionUtils';

export default function SessionsListScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const { sessions, locations, seedDemoSessions } = usePrototype();
  const demoApplied = useRef(false);

  useEffect(() => {
    if (demo !== 'seed' || demoApplied.current) return;
    if (sessions.some((s) => s.status === 'completed')) return;
    seedDemoSessions();
    demoApplied.current = true;
  }, [demo, seedDemoSessions, sessions]);

  const completed = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Screen
      title="All climbing sessions"
      footer={
        <>
          <Button label="Start new session" onPress={() => router.push('/sessions/create')} />
          <Link label="Back to dashboard" onPress={() => router.replace('/dashboard')} />
        </>
      }
    >
      {completed.length === 0 ? (
        <Card>
          <Text variant="body">No completed sessions yet.</Text>
          <PrototypeOnly>
            <Button label="Load demo sessions" variant="secondary" onPress={seedDemoSessions} />
          </PrototypeOnly>
        </Card>
      ) : (
        <Section title={`${completed.length} session${completed.length === 1 ? '' : 's'}`}>
          {completed.map((session) => {
            const loc = locations.find((l) => l.id === session.locationId);
            const duration = formatDuration(
              computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes),
            );
            return (
              <SessionRow
                key={session.id}
                date={session.date}
                duration={duration}
                climbCount={session.climbs.length}
                difficultyRange={sessionDifficultyRange(session.climbs, loc?.levels ?? [])}
                location={session.locationName}
                onPress={() => router.push(`/sessions/${session.id}`)}
              />
            );
          })}
        </Section>
      )}

      {sessions.some((s) => s.status === 'active') ? (
        <Section title="Active session">
          {sessions
            .filter((s) => s.status === 'active')
            .map((session) => (
              <Pressable key={session.id} onPress={() => router.push(`/sessions/${session.id}/active`)}>
                <Card>
                  <Text variant="body" weight="bold">
                    In progress — {session.date}
                  </Text>
                  <Text variant="body">Tap to continue logging climbs</Text>
                </Card>
              </Pressable>
            ))}
        </Section>
      ) : null}
    </Screen>
  );
}
