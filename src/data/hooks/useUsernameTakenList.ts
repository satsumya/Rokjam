import { useEffect, useState } from 'react';

import { checkUsernameTaken } from '../../adapters/api/supabase/profileActions';
import { usesSupabaseBackend } from '../../config/backend';
import { TAKEN_USERNAMES } from '../../constants/mockData';

/**
 * Usernames treated as taken for inline validation.
 * Prototype: mock list. Production + Supabase: live lookup against `profiles`.
 */
export function useUsernameTakenList(draft: string, currentUsername: string): string[] {
  const supabaseCheck = usesSupabaseBackend();
  const [remoteTaken, setRemoteTaken] = useState(false);

  useEffect(() => {
    if (!supabaseCheck) {
      setRemoteTaken(false);
      return;
    }

    const trimmed = draft.trim();
    if (!trimmed || trimmed.toLowerCase() === currentUsername.trim().toLowerCase()) {
      setRemoteTaken(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      void checkUsernameTaken(trimmed)
        .then((taken) => {
          if (!cancelled) setRemoteTaken(taken);
        })
        .catch(() => {
          if (!cancelled) setRemoteTaken(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [supabaseCheck, draft, currentUsername]);

  if (supabaseCheck) {
    return remoteTaken ? [draft.trim().toLowerCase()] : [];
  }

  return TAKEN_USERNAMES;
}
