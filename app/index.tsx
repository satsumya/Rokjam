import { router } from 'expo-router';

import { Button, PrototypeOnly, Screen } from '../src/components';

export default function WelcomeScreen() {
  return (
    <Screen
      title="Welcome"
      footer={
        <>
          <Button label="Sign up" onPress={() => router.push('/auth/signup')} />
          <Button
            label="Log in"
            variant="secondary"
            onPress={() => router.push('/auth/login')}
          />
          <PrototypeOnly>
            <Button
              label="Scenario tester"
              variant="ghost"
              onPress={() => router.push('/scenarios')}
            />
          </PrototypeOnly>
        </>
      }
    >
      <></>
    </Screen>
  );
}
