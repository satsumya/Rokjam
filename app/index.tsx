import { router } from 'expo-router';

import { PrototypeOnly } from '../src/components/PrototypeOnly';
import { WireframeButton, WireframeScreen } from '../src/components/Wireframe';

export default function WelcomeScreen() {
  return (
    <WireframeScreen
      title="Welcome"
      footer={
        <>
          <WireframeButton label="Sign up" onPress={() => router.push('/auth/signup')} />
          <WireframeButton
            label="Log in"
            variant="secondary"
            onPress={() => router.push('/auth/login')}
          />
          <PrototypeOnly>
            <WireframeButton
              label="Scenario tester"
              variant="ghost"
              onPress={() => router.push('/scenarios')}
            />
          </PrototypeOnly>
        </>
      }
    >
      <></>
    </WireframeScreen>
  );
}
