import { router, useLocalSearchParams } from 'expo-router';

import { VerifyEmailView } from '../../src/features/auth/VerifyEmailView';
import { useVerifyEmail } from '../../src/features/auth/useVerifyEmail';

export default function VerifyEmailScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();

  return (
    <VerifyEmailView
      {...useVerifyEmail({
        demo,
        onSuccess: () => router.push('/welcome-signup'),
        onChangeEmail: () => router.replace('/auth/signup'),
      })}
    />
  );
}
