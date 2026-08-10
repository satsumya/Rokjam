import { useEffect } from 'react';

import { fetchPublicSessions, fetchFollowedUsernames } from './communityActions';
import type { ClimbingSession } from '../../../types/climbingSession';

/** Loads public feed and follows from Supabase when the signed-in user changes. */
export function useSupabaseCommunityLoad(
  enabled: boolean,
  userId: string | null,
  setPublicSessions: (sessions: ClimbingSession[]) => void,
  setFollowedUsers: (usernames: string[]) => void,
) {
  useEffect(() => {
    if (!enabled || !userId) return;

    let cancelled = false;

    void Promise.all([fetchPublicSessions(userId), fetchFollowedUsernames(userId)])
      .then(([publicSessions, followedUsers]) => {
        if (cancelled) return;
        setPublicSessions(publicSessions);
        setFollowedUsers(followedUsers);
      })
      .catch((error) => {
        console.warn('[Supabase community] load failed', error);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, userId, setPublicSessions, setFollowedUsers]);
}

export function logCommunityPersistError(scope: string, error: unknown) {
  console.warn(`[Supabase community] ${scope}`, error);
}
