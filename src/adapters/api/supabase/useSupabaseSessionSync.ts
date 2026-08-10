import { useEffect } from 'react';

import { fetchUserSessions } from './sessionActions';
import type { ClimbingSession } from '../../../types/climbingSession';

/** Loads sessions + climbs from Supabase when the signed-in user changes. */
export function useSupabaseSessionLoad(
  enabled: boolean,
  userId: string | null,
  ownerUsername: string,
  ownerAvatar: string,
  setSessions: (sessions: ClimbingSession[]) => void,
) {
  useEffect(() => {
    if (!enabled || !userId) return;

    let cancelled = false;

    void fetchUserSessions(userId, ownerUsername, ownerAvatar)
      .then((loaded) => {
        if (!cancelled) setSessions(loaded);
      })
      .catch((error) => {
        console.warn('[Supabase sessions] load failed', error);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, userId, ownerUsername, ownerAvatar, setSessions]);
}

export function logSessionPersistError(scope: string, error: unknown) {
  console.warn(`[Supabase sessions] ${scope}`, error);
}
