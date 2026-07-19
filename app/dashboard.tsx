import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

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
} from '../src/components';
import { TAKEN_USERNAMES } from '../src/constants/mockData';
import { usePrototype } from '../src/context/PrototypeContext';
import { ui } from '../src/theme/colors';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../src/utils/sessionUtils';
import { getUsernameError, isUsernameAvailable } from '../src/utils/validation';
import { space } from '../src/theme/spacing';

export default function DashboardScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const {
    username,
    setUsername,
    avatar,
    locations,
    strengthTags,
    improvementTags,
    sessions,
    seedDemoSessions,
    seedDemoProfileOnly,
    seedFlowDemo,
    resetSession,
  } = usePrototype();
  const homeLocation = locations.find((loc) => loc.isHome) ?? locations[0];
  // Location is the unlock gate — once one exists, drop the complete-profile prompt.
  const needsProfile = locations.length === 0;
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [addingUsername, setAddingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);

  const usernameError = usernameTouched ? getUsernameError(usernameDraft, TAKEN_USERNAMES) : undefined;
  const usernameSuccess =
    usernameTouched && isUsernameAvailable(usernameDraft, TAKEN_USERNAMES)
      ? 'Username available'
      : undefined;
  const canConfirmUsername =
    Boolean(usernameDraft.trim()) && !getUsernameError(usernameDraft, TAKEN_USERNAMES);

  const confirmUsername = () => {
    setUsernameTouched(true);
    if (!usernameDraft.trim() || getUsernameError(usernameDraft, TAKEN_USERNAMES)) return;
    setUsername(usernameDraft.trim());
    setAddingUsername(false);
    setUsernameDraft('');
    setUsernameTouched(false);
  };

  const cancelUsername = () => {
    setAddingUsername(false);
    setUsernameDraft('');
    setUsernameTouched(false);
  };

  const completedSessions = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));
  const recentSessions = showAllSessions ? completedSessions : completedSessions.slice(0, 3);
  const activeSessions = sessions.filter((s) => s.status === 'active');
  const demoApplied = useRef<string | null>(null);

  useEffect(() => {
    if (!demo || demoApplied.current === demo) return;

    if (demo === 'session-ready') {
      seedDemoSessions();
      demoApplied.current = demo;
    } else if (demo === 'new-user' || demo === 'profile-incomplete') {
      seedFlowDemo('profile-incomplete');
      demoApplied.current = demo;
    } else if (demo === 'profile-ready') {
      seedDemoProfileOnly();
      demoApplied.current = demo;
    } else if (demo === 'one-session') {
      seedFlowDemo('dashboard-one-session');
      demoApplied.current = demo;
    } else if (demo === 'many-sessions') {
      seedFlowDemo('dashboard-many-sessions');
      demoApplied.current = demo;
    } else if (demo === 'mid-session') {
      seedFlowDemo('dashboard-mid-session');
      demoApplied.current = demo;
    } else if (demo === 'seed') {
      seedFlowDemo('dashboard-many-sessions');
      demoApplied.current = demo;
    }
  }, [demo, seedDemoSessions, seedDemoProfileOnly, seedFlowDemo]);

  return (
    <Screen
      headerRight={
        <AccountMenu
          onSignOut={() => {
            resetSession();
            router.replace('/');
          }}
        />
      }
      bottomNav={<BottomNav active="home" />}
    >
      {needsProfile ? (
        <Card>
          <Text variant="body" weight="bold">
            Complete your profile
          </Text>
          <Text variant="body">
            Add your climbing locations and difficulty levels to unlock trends and filters.
          </Text>
          <Button
            label="Set up profile"
            variant="secondary"
            onPress={() => router.push('/profile/setup')}
          />
        </Card>
      ) : null}

      <ProfileSummaryCard
        avatar={avatar}
        username={username}
        locationNickname={homeLocation?.nickname}
        locationName={homeLocation?.name}
        strengthTags={strengthTags}
        improvementTags={improvementTags}
        addingUsername={addingUsername}
        usernameDraft={usernameDraft}
        usernameError={usernameError}
        usernameSuccess={usernameSuccess}
        canConfirmUsername={canConfirmUsername}
        onUsernameChange={(value) => {
          setUsernameDraft(value);
          setUsernameTouched(true);
        }}
        onUsernameConfirm={confirmUsername}
        onUsernameCancel={cancelUsername}
        onStartAddUsername={() => {
          setAddingUsername(true);
          setUsernameDraft('');
          setUsernameTouched(false);
        }}
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
                onPress={() => router.push(`/sessions/${session.id}/active`)}
              />
            </Card>
          ))}
        </Section>
      ) : null}

      {!needsProfile ? (
        <Section title="Recent sessions">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[12], marginBottom: space[4] }}>
            <Pressable onPress={() => setShowAllSessions(false)}>
              <Text variant="body" weight={!showAllSessions ? 'bold' : 'regular'}>
                Recent
              </Text>
            </Pressable>
            <Pressable onPress={() => setShowAllSessions(true)}>
              <Text variant="body" weight={showAllSessions ? 'bold' : 'regular'}>
                All
              </Text>
            </Pressable>
            <Link label="Full list" onPress={() => router.push('/sessions')} />
          </View>
          {recentSessions.length === 0 ? (
            <Text variant="body" color={ui.textMuted}>
              No sessions yet.
            </Text>
          ) : (
            recentSessions.map((session) => {
              const loc = locations.find((l) => l.id === session.locationId);
              return (
                <SessionRow
                  key={session.id}
                  date={session.date}
                  duration={formatDuration(
                    computeDurationMinutes(
                      session.startTime,
                      session.endTime,
                      session.durationMinutes,
                    ),
                  )}
                  climbCount={session.climbs.length}
                  difficultyRange={sessionDifficultyRange(session.climbs, loc?.levels ?? [])}
                  location={session.locationName}
                  onPress={() => router.push(`/sessions/${session.id}`)}
                />
              );
            })
          )}
        </Section>
      ) : null}
    </Screen>
  );
}
