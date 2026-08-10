import { router, useLocalSearchParams } from 'expo-router';

import { SignUpView } from '../../src/features/auth/SignUpView';
import { useSignUp } from '../../src/features/auth/useSignUp';

export default function SignUpScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();

  return (
    <SignUpView
      {...useSignUp({
        demo,
        onSuccess: () => router.push('/auth/verify-email'),
        onLogIn: () => router.replace('/auth/login'),
      })}
    />
  );
}
