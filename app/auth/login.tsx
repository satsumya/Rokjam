import { router, useLocalSearchParams } from 'expo-router';

import { LoginView } from '../../src/features/auth/LoginView';
import { useLogin } from '../../src/features/auth/useLogin';

export default function LoginScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();

  const viewProps = useLogin({
    demo,
    onSuccess: () => router.replace('/dashboard'),
    onForgotPassword: () => router.push('/auth/forgot-password'),
    onSignUp: () => router.replace('/auth/signup'),
  });

  return <LoginView {...viewProps} />;
}
