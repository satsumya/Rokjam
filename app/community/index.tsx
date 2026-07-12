import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { SessionRow } from '../../src/components/SessionClimb';
import { CommunityTrends } from '../../src/components/TrendSummary';
import {
  WireframeBox,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../src/components/Wireframe';
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
    <WireframeScreen
      title="Community"
      footer={<WireframeLink label="Back to dashboard" onPress={() => router.replace('/dashboard')} />}
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
            <Text style={{ fontWeight: tab === value ? '700' : '400' }}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <CommunityTrends sessions={allPublic} />

      <WireframeSection title="Public sessions">
        {feed.length === 0 ? (
          <WireframeBox>
            <Text>No public sessions to show.</Text>
          </WireframeBox>
        ) : (
          feed.map((session) => (
            <WireframeBox key={session.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 24 }}>{session.ownerAvatar}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700' }}>{session.ownerUsername}</Text>
                  <Text style={{ color: ui.textMuted, fontSize: 13 }}>{session.date}</Text>
                </View>
                <WireframeButton
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
                <Text key={climb.id}>
                  {climb.levelName ? `${climb.levelName} · ` : ''}
                  {climb.name ?? 'Unnamed'} —{' '}
                  {climb.attempts[climb.attempts.length - 1]?.progress.join(', ') ?? '—'}
                </Text>
              ))}
            </WireframeBox>
          ))
        )}
      </WireframeSection>
    </WireframeScreen>
  );
}
