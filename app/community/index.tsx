import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import {
  WireframeBox,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../src/components/Wireframe';
import { usePrototype } from '../../src/context/PrototypeContext';

export default function CommunityScreen() {
  const { communityPosts, toggleFollowPost } = usePrototype();
  const [filter, setFilter] = useState<'all' | 'following'>('all');

  const visiblePosts =
    filter === 'following'
      ? communityPosts.filter((post) => post.isFollowing)
      : communityPosts;

  return (
    <WireframeScreen
      title="Community"
      footer={
        <WireframeLink label="Back to dashboard" onPress={() => router.replace('/dashboard')} />
      }
    >
      <WireframeSection title="Feed">
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <FilterChip
            label="All"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterChip
            label="Following"
            active={filter === 'following'}
            onPress={() => setFilter('following')}
          />
        </View>
      </WireframeSection>

      {visiblePosts.length === 0 ? (
        <WireframeBox>
          <Text style={{ fontWeight: '700' }}>No posts in this feed</Text>
          <Text>Follow climbers to see their sessions here.</Text>
        </WireframeBox>
      ) : (
        visiblePosts.map((post) => (
          <WireframeBox key={post.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 28 }}>{post.avatar}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontWeight: '700' }}>{post.username}</Text>
                <Text style={{ color: '#666' }}>{post.timeAgo}</Text>
              </View>
              <WireframeButton
                label={post.isFollowing ? 'Following' : 'Follow'}
                variant={post.isFollowing ? 'secondary' : 'primary'}
                onPress={() => toggleFollowPost(post.id)}
              />
            </View>
            <Text>{post.location}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: post.levelColor,
                }}
              />
              <Text>
                {post.levelLabel} · {post.outcome}
                {post.routeName ? ` · ${post.routeName}` : ''}
              </Text>
            </View>
          </WireframeBox>
        ))
      )}
    </WireframeScreen>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: active ? '#111' : '#CCC',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: active ? '#111' : '#FFF',
      }}
    >
      <Text style={{ color: active ? '#FFF' : '#111' }}>{label}</Text>
    </Pressable>
  );
}
