import { Text, View } from 'react-native';
import { router } from 'expo-router';

import {
  WireframeBox,
  WireframeButton,
  WireframeScreen,
  WireframeSection,
} from '../src/components/Wireframe';
import { usePrototype } from '../src/context/PrototypeContext';

export default function DashboardScreen() {
  const {
    email,
    username,
    avatar,
    locations,
    strengthTags,
    improvementTags,
    profileComplete,
    profileSkipped,
    resetSession,
  } = usePrototype();
  const homeLocation = locations.find((loc) => loc.isHome) ?? locations[0];
  const needsProfile = profileSkipped || !profileComplete || locations.length === 0;

  return (
    <WireframeScreen
      title="Dashboard"
      footer={
        <>
          <WireframeButton
            label="Edit profile"
            variant="secondary"
            onPress={() => router.push('/profile/setup')}
          />
          <WireframeButton
            label="Log out"
            variant="ghost"
            onPress={() => {
              resetSession();
              router.replace('/');
            }}
          />
        </>
      }
    >
      {needsProfile ? (
        <WireframeBox>
          <Text style={{ fontWeight: '700' }}>Complete your profile</Text>
          <Text>Add your climbing locations and difficulty levels to get started.</Text>
          <WireframeButton
            label="Set up profile"
            variant="secondary"
            onPress={() => router.push('/profile/setup')}
          />
        </WireframeBox>
      ) : null}

      <WireframeBox>
        <Text style={{ fontSize: 32 }}>{avatar}</Text>
        <Text style={{ fontWeight: '700', fontSize: 18 }}>{username || 'Member'}</Text>
        <Text>{email || 'member@example.com'}</Text>
      </WireframeBox>

      <WireframeSection title="Profile summary">
        <WireframeBox>
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
                    borderColor: '#DDD',
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
        </WireframeBox>
      </WireframeSection>
    </WireframeScreen>
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
