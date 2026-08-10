import { useEffect } from 'react';
import { router } from 'expo-router';

import { isPrototypeMode } from '../config/appMode';

/** Redirects to welcome when the app runs in production mode. Returns whether the route may render. */
export function usePrototypeRouteGuard(): boolean {
  const allowed = isPrototypeMode();

  useEffect(() => {
    if (!allowed) {
      router.replace('/');
    }
  }, [allowed]);

  return allowed;
}
