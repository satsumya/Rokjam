import { router } from 'expo-router';

import { Button, Screen, Text } from '../src/components';
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
        <Button
          icon="close"
          variant="ghost"
          size="small"
          accessibilityLabel="Skip"
          onPress={skipToDashboard}
        />
      }
      footer={
        <>
          <Button label="Create member profile" colorStyle="style1" onPress={() => router.push('/profile/setup')} />
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
