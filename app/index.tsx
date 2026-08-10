import { router } from 'expo-router';

import { WelcomeView } from '../src/features/welcome/WelcomeView';

export default function WelcomeScreen() {
  return (
    <WelcomeView
      onSignUp={() => router.push('/auth/signup')}
      onLogIn={() => router.push('/auth/login')}
      onScenarioTester={() => router.push('/scenarios')}
    />
  );
}
