import { useCallback } from 'react';
import { router } from 'expo-router';

import { useProfile } from '../../data/hooks/useProfile';

import type { PostSignUpWelcomeViewProps } from './PostSignUpWelcomeView';

export function usePostSignUpWelcome(): PostSignUpWelcomeViewProps {
  const { setProfileSkipped } = useProfile();

  const skipToDashboard = useCallback(() => {
    setProfileSkipped(true);
    router.replace('/dashboard');
  }, [setProfileSkipped]);

  return {
    onCreateProfile: () => router.push('/profile/setup'),
    onSkip: skipToDashboard,
  };
}
