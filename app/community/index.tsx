import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import {
  Avatar,
  Button,
  Card,
  CommunityTrends,
  Link,
  Screen,
  Section,
  SessionRow,
  Text,
} from '../../src/components';
import { usePrototype } from '../../src/context/PrototypeContext';
import { ui } from '../../src/theme/colors';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../../src/utils/sessionUtils';

type Tab = 'all' | 'following' | 'nearby';

function locationMatches(homeName: string, sessionLocation: string) {
  const home = homeName.toLowerCase();
  const loc = sessionLocation.toLowerCase();
  return home.includes('urban climb') && loc.includes('urban climb');
}

export default function CommunityScreen() {
  const { publicSessions, sessions, locations, followedUsers, toggleFollowUser } = usePrototype();
  const [tab, setTab] = useState<Tab>('all');

  const homeLocation = locations.find((l) => l.isHome) ?? locations[0];
  const ownPublic = sessions.filter((s) => s.status === 'completed' && s.isPublic);
  const allPublic = [...publicSessions, ...ownPublic];

  const feed = useMemo(() => {
    let items = [...allPublic];
    if (tab === 'following') {
      items = items.filter((s) => followedUsers.includes(s.ownerUsername));
    }
    if (tab === 'nearby' && homeLocation) {
      items = items
        .filter((s) => locationMatches(homeLocation.name, s.locationName))
        .concat(items.filter((s) => !locationMatches(homeLocation.name, s.locationName)));
    }
    return items.sort((a, b) => b.date.localeCompare(a.date));
  }, [allPublic, tab, followedUsers, homeLocation]);

  return (
    <Screen
      title="Community"
      footer={<Link label="Back to dashboard" onPress={() => router.replace('/dashboard')} />}
    >
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {(
          [
            ['all', 'All'],
            ['nearby', 'Near home gym'],
            ['following', 'Following'],
          ] as const
        ).map(([value, label]) => (
          <Pressable key={value} onPress={() => setTab(value)}>
            <Text variant="body" weight={tab === value ? 'bold' : 'regular'}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <CommunityTrends sessions={allPublic} />

      <Section title="Public sessions">
        {feed.length === 0 ? (
          <Card>
            <Text variant="body">No public sessions to show.</Text>
          </Card>
        ) : (
          feed.map((session) => (
            <Card key={session.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar emoji={session.ownerAvatar} size="md" />
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="bold">
                    {session.ownerUsername}
                  </Text>
                  <Text variant="bodySmall" color={ui.textMuted}>
                    {session.date}
                  </Text>
                </View>
                <Button
                  label={followedUsers.includes(session.ownerUsername) ? 'Following' : 'Follow'}
                  variant="secondary"
                  onPress={() => toggleFollowUser(session.ownerUsername)}
                />
              </View>
              <SessionRow
                date={session.date}
                duration={formatDuration(
                  computeDurationMinutes(
                    session.startTime,
                    session.endTime,
                    session.durationMinutes,
                  ),
                )}
                climbCount={session.climbs.length}
                difficultyRange={sessionDifficultyRange(session.climbs, [])}
                location={session.locationName}
                onPress={() => {}}
              />
              {session.climbs.slice(0, 2).map((climb) => (
                <Text key={climb.id} variant="body">
                  {climb.levelName ? `${climb.levelName} · ` : ''}
                  {climb.name ?? 'Unnamed'} —{' '}
                  {climb.attempts[climb.attempts.length - 1]?.progress.join(', ') ?? '—'}
                </Text>
              ))}
            </Card>
          ))
        )}
      </Section>
    </Screen>
  );
}
