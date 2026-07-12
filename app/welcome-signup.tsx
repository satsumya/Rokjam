import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';

import { WireframeButton, WireframeScreen } from '../src/components/Wireframe';
import { usePrototype } from '../src/context/PrototypeContext';
import { ui } from '../src/theme/colors';

export default function PostSignUpWelcomeScreen() {
  const { setProfileSkipped } = usePrototype();

  const skipToDashboard = () => {
    setProfileSkipped(true);
    router.replace('/dashboard');
  };

  return (
    <WireframeScreen
      title="Welcome"
      headerRight={
        <Pressable onPress={skipToDashboard}>
          <Text style={{ fontSize: 24, color: ui.textMuted }}>×</Text>
        </Pressable>
      }
      footer={
        <>
          <WireframeButton label="Create member profile" onPress={() => router.push('/profile/setup')} />
          <WireframeButton label="Skip for now" variant="ghost" onPress={skipToDashboard} />
        </>
      }
    >
      <Text style={{ color: ui.textMuted, lineHeight: 22 }}>
        Your account is ready. Set up your member profile to personalise your climbing experience.
      </Text>
    </WireframeScreen>
  );
}
