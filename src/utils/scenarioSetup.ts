import type { Scenario, ScenarioSetup, ScenarioUserType } from '../constants/scenarios';
import type { Href } from 'expo-router';
import { router } from 'expo-router';

type SetupContext = {
  resetSession: () => void;
  seedReturningUser: () => void;
  seedDemoProfileOnly: () => void;
};

export function parseScenarioPath(path: string): Href {
  const [pathname, query = ''] = path.split('?');
  if (!query) return pathname as Href;

  const params: Record<string, string> = {};
  for (const part of query.split('&')) {
    if (!part) continue;
    const [key, value = ''] = part.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value);
  }

  return { pathname: pathname as Href, params } as Href;
}

export function navigateScenarioPath(path: string) {
  // Defer so context setup (reset/seed) commits before the next screen reads it.
  queueMicrotask(() => {
    router.push(parseScenarioPath(path));
  });
}

export function resolveScenarioSetup(
  scenario: Scenario,
  userFilter: ScenarioUserType | 'all',
): ScenarioSetup {
  if (scenario.userType !== 'any') return scenario.setup;
  if (userFilter === 'existing') return scenario.setupExisting ?? 'returning';
  if (userFilter === 'new') return scenario.setupNew ?? 'fresh';
  return scenario.setup;
}

export function applyScenarioSetup(
  setup: ScenarioSetup,
  { resetSession, seedReturningUser, seedDemoProfileOnly }: SetupContext,
) {
  resetSession();
  if (setup === 'returning') seedReturningUser();
  else if (setup === 'profile-only') seedDemoProfileOnly();
}

export function filterScenarios(
  scenarios: Scenario[],
  filters: {
    flow?: Scenario['flow'] | 'all';
    userType?: ScenarioUserType | 'all';
    type?: Scenario['type'] | 'all';
  },
) {
  return scenarios.filter((scenario) => {
    if (filters.flow && filters.flow !== 'all' && scenario.flow !== filters.flow) return false;
    if (filters.type && filters.type !== 'all' && scenario.type !== filters.type) return false;
    if (filters.userType && filters.userType !== 'all') {
      if (scenario.userType !== filters.userType && scenario.userType !== 'any') return false;
    }
    return true;
  });
}
