import { Pressable } from 'react-native';

import { BottomNav, Card, Screen, Section, SessionRow, Text } from '../../components';
import { ui } from '../../theme/colors';
import type { ClimbingSession } from '../../types/climbingSession';

export type SessionsListRow = {
  session: ClimbingSession;
  duration: string;
  difficultyRange: string;
};

export type SessionsListViewProps = {
  completed: SessionsListRow[];
  activeSessions: ClimbingSession[];
  onOpenSession: (sessionId: string) => void;
  onContinueActiveSession: (sessionId: string) => void;
};

export function SessionsListView({
  completed,
  activeSessions,
  onOpenSession,
  onContinueActiveSession,
}: SessionsListViewProps) {
  return (
    <Screen title="Climbing sessions" bottomNav={<BottomNav active="sessions" />}>
      {completed.length === 0 ? (
        <Text variant="body" color={ui.textMuted}>
          No completed sessions yet.
        </Text>
      ) : (
        <Section title={`${completed.length} session${completed.length === 1 ? '' : 's'}`}>
          {completed.map(({ session, duration, difficultyRange }) => (
            <SessionRow
              key={session.id}
              date={session.date}
              duration={duration}
              climbCount={session.climbs.length}
              difficultyRange={difficultyRange}
              location={session.locationName}
              onPress={() => onOpenSession(session.id)}
            />
          ))}
        </Section>
      )}

      {activeSessions.length > 0 ? (
        <Section title="Active session">
          {activeSessions.map((session) => (
            <Pressable key={session.id} onPress={() => onContinueActiveSession(session.id)}>
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
