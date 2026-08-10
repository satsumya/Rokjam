import {
  BottomSheet,
  Button,
  Card,
  ClimbCard,
  Link,
  Screen,
  Section,
  ShareMockBanner,
  Text,
} from '../../components';
import type { ClimbingSession } from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import { formatSessionDate } from '../../utils/sessionUtils';

export type SessionDetailViewProps = {
  session: ClimbingSession | null;
  duration: string;
  shareVisible: boolean;
  showDeleteSheet: boolean;
  onContinueSession: () => void;
  onEditSession: () => void;
  onShare: () => void;
  onDeleteRequest: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onBackToSessions: () => void;
};

export function SessionDetailView({
  session,
  duration,
  shareVisible,
  showDeleteSheet,
  onContinueSession,
  onEditSession,
  onShare,
  onDeleteRequest,
  onConfirmDelete,
  onCancelDelete,
  onBackToSessions,
}: SessionDetailViewProps) {
  if (!session) {
    return (
      <Screen
        title="Session not found"
        footer={<Link label="Back to sessions" onPress={onBackToSessions} />}
      >
        <Card>
          <Text variant="body">This session could not be found.</Text>
        </Card>
      </Screen>
    );
  }

  const isCompleted = session.status === 'completed';

  return (
    <Screen
      title="Session details"
      footer={
        <>
          {session.status === 'active' ? (
            <Button label="Continue session" onPress={onContinueSession} />
          ) : (
            <Button label="Edit session" onPress={onEditSession} />
          )}
          {isCompleted ? (
            <Button label="Share session" variant="secondary" onPress={onShare} />
          ) : null}
          <Button label="Delete session" variant="ghost" onPress={onDeleteRequest} />
          <Link label="Back to sessions" onPress={onBackToSessions} />
        </>
      }
      overlay={
        <BottomSheet
          visible={showDeleteSheet}
          title="Delete session?"
          onClose={onCancelDelete}
        >
          <Text variant="body">This will permanently remove this session and all climbs in it.</Text>
          <Button label="Delete session" onPress={onConfirmDelete} />
          <Button label="Cancel" variant="ghost" onPress={onCancelDelete} />
        </BottomSheet>
      }
    >
      <ShareMockBanner visible={shareVisible} />

      <Card>
        <Text variant="body" weight="bold">
          {formatSessionDate(session.date)}
        </Text>
        <Text variant="body">{session.locationName || 'No location set'}</Text>
        <Text variant="body">
          {session.startTime}
          {session.endTime ? ` – ${session.endTime}` : ''} ({duration})
        </Text>
        <Text variant="body">
          {session.climbs.length} climb{session.climbs.length === 1 ? '' : 's'} ·{' '}
          {session.isPublic ? 'Public' : 'Private'}
        </Text>
      </Card>

      <Section title="Climbs">
        {session.climbs.length === 0 ? (
          <Text variant="body" color={ui.textMuted}>
            No climbs logged in this session.
          </Text>
        ) : (
          session.climbs.map((climb) => (
            <ClimbCard
              key={climb.id}
              climb={climb}
              onShare={isCompleted ? onShare : undefined}
            />
          ))
        )}
      </Section>
    </Screen>
  );
}
