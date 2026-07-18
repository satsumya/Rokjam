import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  Avatar,
  Button,
  Card,
  DashboardTrends,
  Icon,
  Link,
  Screen,
  Section,
  SessionRow,
  Text,
} from '../src/components';
import { usePrototype } from '../src/context/PrototypeContext';
import { ui } from '../src/theme/colors';
import type { TrendTimeframe } from '../src/types/climbingSession';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../src/utils/sessionUtils';
import { space } from '../src/theme/spacing';

export default function DashboardScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const {
    email,
    username,
    avatar,
    locations,
    strengthTags,
    improvementTags,
    profileComplete,
    profileSkipped,
    sessions,
    seedDemoSessions,
    seedDemoProfileOnly,
    seedFlowDemo,
    seedReturningUser,
    resetSession,
  } = usePrototype();
  const homeLocation = locations.find((loc) => loc.isHome) ?? locations[0];
  const needsProfile = profileSkipped || !profileComplete || locations.length === 0;
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [timeframe, setTimeframe] = useState<TrendTimeframe>('month');

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
      seedReturningUser();
      demoApplied.current = demo;
    }
  }, [
    demo,
    seedDemoSessions,
    seedDemoProfileOnly,
    seedFlowDemo,
    seedReturningUser,
  ]);

  return (
    <Screen
      title="Dashboard"
      headerRight={
        <Pressable
          onPress={() => {
            resetSession();
            router.replace('/');
          }}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          hitSlop={8}
          style={{ padding: space[4] }}
        >
          <Icon name="close" size="md" color={ui.textLabel} />
        </Pressable>
      }
      footer={
        <>
          <Button
            label="Start climbing session"
            colorStyle="style2"
            onPress={() => router.push('/sessions/create')}
          />
          <Button
            label="Community"
            variant="secondary"
            onPress={() => router.push('/community')}
          />
        </>
      }
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

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[12] }}>
          <Avatar emoji={avatar} size="lg" />
          <View style={{ flex: 1, minWidth: 0, gap: space[4] }}>
            <Text variant="bodyLarge" weight="bold">
              {username || 'Member'}
            </Text>
            <Text variant="body" color={ui.textMuted}>
              {email || 'member@example.com'}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/profile/setup')}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space[4], padding: space[4], flexShrink: 0 }}
          >
            <Icon name="pencil" size="xs" color={ui.text} />
            <Text variant="body" style={{ textDecorationLine: 'underline' }}>
              Edit
            </Text>
          </Pressable>
        </View>
      </Card>

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
        <>
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

          <DashboardTrends
            sessions={completedSessions}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </>
      ) : null}

      <Section title="Profile summary">
        <ViewRow label="Home location" value={homeLocation?.name ?? 'Not set'} home={homeLocation?.isHome} />
        {homeLocation?.nickname ? <Text variant="body">Nickname: {homeLocation.nickname}</Text> : null}
        {homeLocation?.levels.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[6], marginTop: space[4] }}>
            {homeLocation.levels.map((level) => (
              <View
                key={level.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: space[4],
                  borderWidth: 1,
                  borderColor: ui.borderSubtle,
                  borderRadius: 12,
                  paddingHorizontal: space[8],
                  paddingVertical: space[4],
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: level.color,
                  }}
                />
                <Text variant="body">{level.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text variant="body">No levels set</Text>
        )}
        {strengthTags.length ? (
          <Text variant="body">Strengths: {strengthTags.join(', ')}</Text>
        ) : null}
        {improvementTags.length ? (
          <Text variant="body">Areas to improve: {improvementTags.join(', ')}</Text>
        ) : null}
      </Section>
    </Screen>
  );
}

function ViewRow({ label, value, home }: { label: string; value: string; home?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: space[4] }}>
      <Text variant="body">{label}: </Text>
      {home ? <Icon name="house" size="xs" color={ui.text} /> : null}
      <Text variant="body" style={{ flexShrink: 1, minWidth: 0 }}>
        {value}
      </Text>
    </View>
  );
}
