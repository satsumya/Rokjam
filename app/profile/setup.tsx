import { router } from 'expo-router';

import { ProfileSetupView } from '../../src/features/profile/ProfileSetupView';
import { useProfileSetup } from '../../src/features/profile/useProfileSetup';

export default function ProfileSetupScreen() {
  return (
    <ProfileSetupView
      {...useProfileSetup({
        onDone: () => router.replace('/dashboard'),
      })}
    />
  );
}
