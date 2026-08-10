import { useEffect } from 'react';

import { fetchUserProfile } from './profileActions';
import type { Location } from '../../../domain/types/profile';

type ProfileSetters = {
  setUsername: (value: string) => void;
  setAvatar: (value: string) => void;
  setLocations: (value: Location[]) => void;
  setStrengthTags: (value: string[]) => void;
  setImprovementTags: (value: string[]) => void;
  setProfileComplete: (value: boolean) => void;
  setProfileSkipped: (value: boolean) => void;
};

/** Loads profile rows from Supabase when the signed-in user changes. */
export function useSupabaseProfileLoad(
  enabled: boolean,
  userId: string | null,
  setters: ProfileSetters,
) {
  useEffect(() => {
    if (!enabled || !userId) return;

    let cancelled = false;

    void fetchUserProfile(userId)
      .then((loaded) => {
        if (cancelled || !loaded) return;
        setters.setUsername(loaded.username);
        setters.setAvatar(loaded.avatar);
        setters.setLocations(loaded.locations);
        setters.setStrengthTags(loaded.strengthTags);
        setters.setImprovementTags(loaded.improvementTags);
        setters.setProfileComplete(loaded.profileComplete);
        setters.setProfileSkipped(loaded.profileSkipped);
      })
      .catch((error) => {
        console.warn('[Supabase profile] load failed', error);
      });

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    userId,
    setters.setUsername,
    setters.setAvatar,
    setters.setLocations,
    setters.setStrengthTags,
    setters.setImprovementTags,
    setters.setProfileComplete,
    setters.setProfileSkipped,
  ]);
}

export function logProfilePersistError(scope: string, error: unknown) {
  console.warn(`[Supabase profile] ${scope}`, error);
}
