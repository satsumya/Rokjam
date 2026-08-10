import { Pressable, View } from 'react-native';

import {
  AccountMenu,
  BottomNav,
  Button,
  Card,
  Link,
  ProfileSummaryCard,
  Screen,
  Section,
  SessionRow,
  Text,
} from '../../components';
import type { AddLocationWithLevelsHandler } from '../../domain/types/profile';
import { ui } from '../../theme/colors';
import type { ClimbingSession } from '../../types/climbingSession';
import { space } from '../../theme/spacing';

export type DashboardSessionRow = {
  session: ClimbingSession;
  duration: string;
  difficultyRange: string;
};

export type DashboardViewProps = {
  needsProfile: boolean;
  avatar: string;
  username: string;
  homeLocationNickname?: string;
  homeLocationName?: string;
  strengthTags: string[];
  improvementTags: string[];
  addingUsername: boolean;
  usernameDraft: string;
  usernameError?: string;
  usernameSuccess?: string;
  canConfirmUsername: boolean;
  activeSessions: ClimbingSession[];
  recentSessions: DashboardSessionRow[];
  showAllSessions: boolean;
  onSignOut: () => void;
  onSetupProfile: () => void;
  onUsernameChange: (value: string) => void;
  onUsernameConfirm: () => void;
  onUsernameCancel: () => void;
  onStartAddUsername: () => void;
  onContinueSession: (sessionId: string) => void;
  onShowRecentSessions: () => void;
  onShowAllSessions: () => void;
  onOpenSessionsList: () => void;
  onOpenSession: (sessionId: string) => void;
  onAddLocationWithLevels: AddLocationWithLevelsHandler;
};

export function DashboardView({
  needsProfile,
  avatar,
  username,
  homeLocationNickname,
  homeLocationName,
  strengthTags,
  improvementTags,
  addingUsername,
  usernameDraft,
  usernameError,
  usernameSuccess,
  canConfirmUsername,
  activeSessions,
  recentSessions,
  showAllSessions,
  onSignOut,
  onSetupProfile,
  onUsernameChange,
  onUsernameConfirm,
  onUsernameCancel,
  onStartAddUsername,
  onContinueSession,
  onShowRecentSessions,
  onShowAllSessions,
  onOpenSessionsList,
  onOpenSession,
  onAddLocationWithLevels,
}: DashboardViewProps) {
  return (
    <Screen headerRight={<AccountMenu onSignOut={onSignOut} />} bottomNav={<BottomNav active="home" />}>
      {needsProfile ? (
        <Card>
          <Text variant="body" weight="bold">
            Complete your profile
          </Text>
          <Text variant="body">
            Add your climbing locations and difficulty levels to unlock trends and filters.
          </Text>
          <Button label="Set up profile" variant="secondary" onPress={onSetupProfile} />
        </Card>
      ) : null}

      <ProfileSummaryCard
        avatar={avatar}
        username={username}
        locationNickname={homeLocationNickname}
        locationName={homeLocationName}
        strengthTags={strengthTags}
        improvementTags={improvementTags}
        addingUsername={addingUsername}
        usernameDraft={usernameDraft}
        usernameError={usernameError}
        usernameSuccess={usernameSuccess}
        canConfirmUsername={canConfirmUsername}
        onUsernameChange={onUsernameChange}
        onUsernameConfirm={onUsernameConfirm}
        onUsernameCancel={onUsernameCancel}
        onStartAddUsername={onStartAddUsername}
        onAddLocationWithLevels={onAddLocationWithLevels}
      />

      {needsProfile || activeSessions.length > 0 ? (
        <Section title="Climbing">
          {needsProfile ? (
            <Text variant="body" color={ui.textMuted} style={{ marginBottom: space[4] }}>
              Profile incomplete — you can still start a session and add a location during it.
            </Text>
          ) : null}
          {activeSessions.map((session) => (
            <Card key={session.id}>
              <Text variant="body" weight="bold">
                Session in progress{activeSessions.length > 1 ? ` — ${session.date}` : ''}
              </Text>
              <Button
                label="Continue session"
                onPress={() => onContinueSession(session.id)}
              />
            </Card>
          ))}
        </Section>
      ) : null}

      {!needsProfile ? (
        <Section title="Recent sessions">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[12], marginBottom: space[4] }}>
            <Pressable onPress={onShowRecentSessions}>
              <Text variant="body" weight={!showAllSessions ? 'bold' : 'regular'}>
                Recent
              </Text>
            </Pressable>
            <Pressable onPress={onShowAllSessions}>
              <Text variant="body" weight={showAllSessions ? 'bold' : 'regular'}>
                All
              </Text>
            </Pressable>
            <Link label="Full list" onPress={onOpenSessionsList} />
          </View>
          {recentSessions.length === 0 ? (
            <Text variant="body" color={ui.textMuted}>
              No sessions yet.
            </Text>
          ) : (
            recentSessions.map(({ session, duration, difficultyRange }) => (
              <SessionRow
                key={session.id}
                date={session.date}
                duration={duration}
                climbCount={session.climbs.length}
                difficultyRange={difficultyRange}
                location={session.locationName}
                onPress={() => onOpenSession(session.id)}
              />
            ))
          )}
        </Section>
      ) : null}
    </Screen>
  );
}
