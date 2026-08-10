import { Pressable, View } from 'react-native';

import {
  Avatar,
  BottomNav,
  Button,
  Card,
  CommunityTrends,
  Screen,
  Section,
  SessionRow,
  Text,
} from '../../components';
import type { ClimbingSession } from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export type CommunityTab = 'all' | 'following' | 'nearby';

export type CommunityFeedItem = {
  session: ClimbingSession;
  duration: string;
  difficultyRange: string;
};

export type CommunityViewProps = {
  tab: CommunityTab;
  feed: CommunityFeedItem[];
  allPublicSessions: ClimbingSession[];
  followedUsers: string[];
  onTabChange: (tab: CommunityTab) => void;
  onToggleFollow: (username: string) => void;
};

export function CommunityView({
  tab,
  feed,
  allPublicSessions,
  followedUsers,
  onTabChange,
  onToggleFollow,
}: CommunityViewProps) {
  return (
    <Screen title="Community" bottomNav={<BottomNav active="community" />}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[12] }}>
        {(
          [
            ['all', 'All'],
            ['nearby', 'Near home gym'],
            ['following', 'Following'],
          ] as const
        ).map(([value, label]) => (
          <Pressable key={value} onPress={() => onTabChange(value)}>
            <Text variant="body" weight={tab === value ? 'bold' : 'regular'}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <CommunityTrends sessions={allPublicSessions} />

      <Section title="Public sessions">
        {feed.length === 0 ? (
          <Text variant="body" color={ui.textMuted}>
            No public sessions to show.
          </Text>
        ) : (
          feed.map(({ session, duration, difficultyRange }) => (
            <Card key={session.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
                <Avatar emoji={session.ownerAvatar} size="md" />
                <View style={{ flex: 1, minWidth: 100 }}>
                  <Text variant="body" weight="bold">
                    {session.ownerUsername}
                  </Text>
                  <Text variant="bodySmall" color={ui.textMuted}>
                    {session.date}
                  </Text>
                </View>
                <View style={{ flexShrink: 0 }}>
                  <Button
                    label={followedUsers.includes(session.ownerUsername) ? 'Following' : 'Follow'}
                    variant="secondary"
                    onPress={() => onToggleFollow(session.ownerUsername)}
                  />
                </View>
              </View>
              <SessionRow
                framed={false}
                date={session.date}
                duration={duration}
                climbCount={session.climbs.length}
                difficultyRange={difficultyRange}
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
