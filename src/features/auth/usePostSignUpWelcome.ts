import { useCallback } from 'react';
import { router } from 'expo-router';

import { usePrototype } from '../../context/PrototypeContext';

import type { PostSignUpWelcomeViewProps } from './PostSignUpWelcomeView';

export function usePostSignUpWelcome(): PostSignUpWelcomeViewProps {
  const { setProfileSkipped } = usePrototype();

  const skipToDashboard = useCallback(() => {
    setProfileSkipped(true);
    router.replace('/dashboard');
  }, [setProfileSkipped]);

  return {
    onCreateProfile: () => router.push('/profile/setup'),
    onSkip: skipToDashboard,
  };
}
