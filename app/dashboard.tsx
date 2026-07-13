import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  Button,
  Card,
  DashboardTrends,
  Link,
  Screen,
  Section,
  SessionRow,
} from '../src/components';
import { usePrototype } from '../src/context/PrototypeContext';
import { ui } from '../src/theme/colors';
import type { TrendTimeframe } from '../src/types/climbingSession';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../src/utils/sessionUtils';

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
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 22, lineHeight: 24, color: ui.textLabel }}>⏻</Text>
        </Pressable>
      }
      footer={
        <>
          <Button
            label="Start climbing session"
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
          <Text style={{ fontWeight: '700' }}>Complete your profile</Text>
          <Text>Add your climbing locations and difficulty levels to unlock trends and filters.</Text>
          <Button
            label="Set up profile"
            variant="secondary"
            onPress={() => router.push('/profile/setup')}
          />
        </Card>
      ) : null}

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 32 }}>{avatar}</Text>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontWeight: '700', fontSize: 18 }}>{username || 'Member'}</Text>
            <Text style={{ color: ui.textMuted }}>{email || 'member@example.com'}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/profile/setup')}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 }}
          >
            <Text style={{ fontSize: 16, color: ui.text }}>✎</Text>
            <Text style={{ fontSize: 15, color: ui.text, textDecorationLine: 'underline' }}>Edit</Text>
          </Pressable>
        </View>
      </Card>

      {needsProfile || activeSessions.length > 0 ? (
        <Section title="Climbing">
          {needsProfile ? (
            <Text style={{ color: ui.textMuted, lineHeight: 20, marginBottom: 4 }}>
              Profile incomplete — you can still start a session and add a location during it.
            </Text>
          ) : null}
          {activeSessions.map((session) => (
            <Card key={session.id}>
              <Text style={{ fontWeight: '700' }}>
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
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 4 }}>
              <Pressable onPress={() => setShowAllSessions(false)}>
                <Text style={{ fontWeight: !showAllSessions ? '700' : '400' }}>Recent</Text>
              </Pressable>
              <Pressable onPress={() => setShowAllSessions(true)}>
                <Text style={{ fontWeight: showAllSessions ? '700' : '400' }}>All</Text>
              </Pressable>
              <Link label="Full list" onPress={() => router.push('/sessions')} />
            </View>
            {recentSessions.length === 0 ? (
              <Card>
                <Text>No sessions yet.</Text>
              </Card>
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
        <Card>
          <ViewRow label="Home location" value={homeLocation?.name ?? 'Not set'} home={homeLocation?.isHome} />
          {homeLocation?.nickname ? <Text>Nickname: {homeLocation.nickname}</Text> : null}
          {homeLocation?.levels.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {homeLocation.levels.map((level) => (
                <View
                  key={level.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    borderWidth: 1,
                    borderColor: ui.borderSubtle,
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
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
                  <Text>{level.name}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text>No levels set</Text>
          )}
          {strengthTags.length ? <Text>Strengths: {strengthTags.join(', ')}</Text> : null}
          {improvementTags.length ? <Text>Areas to improve: {improvementTags.join(', ')}</Text> : null}
        </Card>
      </Section>
    </Screen>
  );
}

function ViewRow({ label, value, home }: { label: string; value: string; home?: boolean }) {
  return (
    <Text>
      {label}: {home ? '🏠 ' : ''}
      {value}
    </Text>
  );
}
