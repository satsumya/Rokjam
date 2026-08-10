import { router, useLocalSearchParams } from 'expo-router';

import { ResetPasswordView } from '../../src/features/auth/ResetPasswordView';
import { useResetPassword } from '../../src/features/auth/useResetPassword';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <ResetPasswordView
      {...useResetPassword({
        email,
        onSuccess: () => router.replace('/auth/login'),
        onBackToLogin: () => router.replace('/auth/login'),
      })}
    />
  );
}
