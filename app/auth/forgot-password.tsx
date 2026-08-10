import { router } from 'expo-router';

import { ForgotPasswordView } from '../../src/features/auth/ForgotPasswordView';
import { useForgotPassword } from '../../src/features/auth/useForgotPassword';

export default function ForgotPasswordScreen() {
  return (
    <ForgotPasswordView
      {...useForgotPassword({
        onSuccess: (email) =>
          router.push({
            pathname: '/auth/reset-password',
            params: { email },
          }),
        onBackToLogin: () => router.replace('/auth/login'),
      })}
    />
  );
}
