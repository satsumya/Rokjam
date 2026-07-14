import { router } from 'expo-router';

import { Button, PrototypeOnly, Screen } from '../src/components';

export default function WelcomeScreen() {
  return (
    <Screen
      title="Welcome"
      footer={
        <>
          <Button label="Sign up" colorStyle="style2" onPress={() => router.push('/auth/signup')} />
          <Button
            label="Log in"
            colorStyle="style1"
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
