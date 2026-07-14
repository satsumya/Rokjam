import { Pressable } from 'react-native';
import { router } from 'expo-router';

import { Button, Icon, Screen, Text } from '../src/components';
import { usePrototype } from '../src/context/PrototypeContext';
import { ui } from '../src/theme/colors';

export default function PostSignUpWelcomeScreen() {
  const { setProfileSkipped } = usePrototype();

  const skipToDashboard = () => {
    setProfileSkipped(true);
    router.replace('/dashboard');
  };

  return (
    <Screen
      title="Welcome"
      headerRight={
        <Pressable onPress={skipToDashboard} accessibilityRole="button" accessibilityLabel="Skip">
          <Icon name="close" size="md" color={ui.textMuted} />
        </Pressable>
      }
      footer={
        <>
          <Button label="Create member profile" colorStyle="style2" onPress={() => router.push('/profile/setup')} />
          <Button label="Skip for now" variant="ghost" onPress={skipToDashboard} />
        </>
      }
    >
      <Text variant="body" color={ui.textMuted}>
        Your account is ready. Set up your member profile to personalise your climbing experience.
      </Text>
    </Screen>
  );
}
