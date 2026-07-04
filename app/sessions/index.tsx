import { useEffect, useRef } from 'react';
import { Pressable, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { SessionRow } from '../../src/components/SessionClimb';
import {
  WireframeBox,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../src/components/Wireframe';
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
    <WireframeScreen
      title="All climbing sessions"
      footer={
        <>
          <WireframeButton label="Start new session" onPress={() => router.push('/sessions/create')} />
          <WireframeLink label="Back to dashboard" onPress={() => router.replace('/dashboard')} />
        </>
      }
    >
      {completed.length === 0 ? (
        <WireframeBox>
          <Text>No completed sessions yet.</Text>
          <WireframeButton label="Load demo sessions" variant="secondary" onPress={seedDemoSessions} />
        </WireframeBox>
      ) : (
        <WireframeSection title={`${completed.length} session${completed.length === 1 ? '' : 's'}`}>
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
        </WireframeSection>
      )}

      {sessions.some((s) => s.status === 'active') ? (
        <WireframeSection title="Active session">
          {sessions
            .filter((s) => s.status === 'active')
            .map((session) => (
              <Pressable key={session.id} onPress={() => router.push(`/sessions/${session.id}/active`)}>
                <WireframeBox>
                  <Text style={{ fontWeight: '700' }}>In progress — {session.date}</Text>
                  <Text>Tap to continue logging climbs</Text>
                </WireframeBox>
              </Pressable>
            ))}
        </WireframeSection>
      ) : null}
    </WireframeScreen>
  );
}
