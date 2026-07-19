export type ScenarioSetup = 'fresh' | 'profile-only' | 'returning';

export type ScenarioUserType = 'new' | 'existing' | 'any';

export type ScenarioFlow =
  | 'sign-up-login'
  | 'member-profile'
  | 'session-create'
  | 'session-view-edit'
  | 'dashboard'
  | 'community';

export type Scenario = {
  id: string;
  flow: ScenarioFlow;
  title: string;
  path: string;
  type: 'Happy path' | 'Alternate path' | 'Error path';
  userType: ScenarioUserType;
  setup: ScenarioSetup;
  setupNew?: ScenarioSetup;
  setupExisting?: ScenarioSetup;
  steps: string;
};

/** Matches flow spec filenames in docs/tickets/Flow/ (without .md). */
export const SCENARIO_FLOWS: { id: ScenarioFlow; doc: string }[] = [
  { id: 'sign-up-login', doc: 'SignUpLogin' },
  { id: 'member-profile', doc: 'MemberProfile' },
  { id: 'session-create', doc: 'ClimbingSessionCreate' },
  { id: 'session-view-edit', doc: 'ClimbingSessionViewEdit' },
  { id: 'dashboard', doc: 'Dashboard' },
  { id: 'community', doc: 'Community' },
];

export function flowDocName(flowId: ScenarioFlow) {
  return SCENARIO_FLOWS.find((flow) => flow.id === flowId)?.doc ?? flowId;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'signup-happy',
    flow: 'sign-up-login',
    title: 'New user sign up',
    path: '/auth/signup',
    type: 'Happy path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Sign up → Verify code → Welcome → Profile setup',
  },
  {
    id: 'signup-error',
    flow: 'sign-up-login',
    title: 'Sign up validation error',
    path: '/auth/signup?demo=error-empty',
    type: 'Error path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Empty fields show real-time validation errors',
  },
  {
    id: 'signup-existing',
    flow: 'sign-up-login',
    title: 'Existing email tries sign up',
    path: '/auth/signup',
    type: 'Alternate path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Enter returning.user@example.com → “Email already in use”; switch to Log in with email kept',
  },
  {
    id: 'verify-error',
    flow: 'sign-up-login',
    title: 'Verification code error',
    path: '/auth/verify-email',
    type: 'Error path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Enter 000000 → Invalid code error; any other 6 digits succeed',
  },
  {
    id: 'login-happy',
    flow: 'sign-up-login',
    title: 'Returning user login',
    path: '/auth/login?demo=prefill',
    type: 'Happy path',
    userType: 'existing',
    setup: 'fresh',
    steps: 'Log in with email or username → Dashboard with profile and sessions',
  },
  {
    id: 'login-error',
    flow: 'sign-up-login',
    title: 'Login validation error',
    path: '/auth/login?demo=error-empty',
    type: 'Error path',
    userType: 'existing',
    setup: 'fresh',
    steps: 'Submit empty fields → Real-time validation errors',
  },
  {
    id: 'forgot-password',
    flow: 'sign-up-login',
    title: 'Password recovery',
    path: '/auth/forgot-password',
    type: 'Alternate path',
    userType: 'any',
    setup: 'fresh',
    setupNew: 'fresh',
    setupExisting: 'returning',
    steps: 'Forgot password → Reset password → Log in',
  },
  {
    id: 'welcome-skip',
    flow: 'sign-up-login',
    title: 'Skip profile from welcome',
    path: '/welcome-signup',
    type: 'Alternate path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Skip welcome → Dashboard prompts profile completion',
  },
  {
    id: 'profile-happy',
    flow: 'member-profile',
    title: 'Complete member profile',
    path: '/profile/setup',
    type: 'Happy path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Optional location + levels → Tags → Go to dashboard',
  },
  {
    id: 'profile-exit',
    flow: 'member-profile',
    title: 'Exit profile without completing',
    path: '/profile/setup',
    type: 'Alternate path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Tap Exit or Skip → Dashboard shows complete profile prompt',
  },
  {
    id: 'profile-no-location',
    flow: 'member-profile',
    title: 'Go to dashboard without location',
    path: '/profile/setup',
    type: 'Alternate path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Tap Go to dashboard without adding a location → can add location during a session',
  },
  {
    id: 'profile-username-taken',
    flow: 'member-profile',
    title: 'Username already taken',
    path: '/profile/setup',
    type: 'Error path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Enter username "thegoat" → Taken error',
  },
  {
    id: 'session-happy',
    flow: 'session-create',
    title: 'Create and end session',
    path: '/dashboard?demo=session-ready',
    type: 'Happy path',
    userType: 'existing',
    setup: 'returning',
    steps: 'Start session → Add climbs → Save/end as private',
  },
  {
    id: 'session-new-user',
    flow: 'session-create',
    title: 'Profile ready, no sessions yet',
    path: '/dashboard?demo=new-user',
    type: 'Alternate path',
    userType: 'existing',
    setup: 'profile-only',
    steps: 'Dashboard with profile but no sessions → Start first session',
  },
  {
    id: 'session-incomplete-profile',
    flow: 'session-create',
    title: 'Incomplete profile — start anyway',
    path: '/sessions/create',
    type: 'Alternate path',
    userType: 'new',
    setup: 'fresh',
    steps: 'Start session without profile → Prompt shown → Add location inline',
  },
  {
    id: 'session-public-username',
    flow: 'session-create',
    title: 'Public session username validation',
    path: '/sessions/create',
    type: 'Error path',
    userType: 'existing',
    setup: 'profile-only',
    steps: 'Start session → Save/end as public → Enter "thegoat" → Validation error',
  },
  {
    id: 'sessions-list',
    flow: 'session-view-edit',
    title: 'View all sessions',
    path: '/sessions?demo=seed',
    type: 'Happy path',
    userType: 'existing',
    setup: 'returning',
    steps: 'Full list → Open session → Edit climbs → Delete with confirmation',
  },
  {
    id: 'dashboard-recent',
    flow: 'session-view-edit',
    title: 'Dashboard recent vs all',
    path: '/dashboard?demo=session-ready',
    type: 'Happy path',
    userType: 'existing',
    setup: 'returning',
    steps: 'Toggle Recent/All → Open session detail',
  },
  {
    id: 'trends-happy',
    flow: 'dashboard',
    title: 'Trends with session data',
    path: '/insights?demo=seed',
    type: 'Happy path',
    userType: 'existing',
    setup: 'returning',
    steps: 'Insights tab → Month default → Switch week / month / 3 months → Standout trends',
  },
  {
    id: 'trends-empty',
    flow: 'dashboard',
    title: 'Trends without session data',
    path: '/insights?demo=profile-ready',
    type: 'Alternate path',
    userType: 'existing',
    setup: 'profile-only',
    steps: 'Insights with complete profile but no sessions → Empty trends state',
  },
  {
    id: 'community-happy',
    flow: 'community',
    title: 'Public sessions feed',
    path: '/community',
    type: 'Happy path',
    userType: 'existing',
    setup: 'returning',
    steps: 'All / Near home / Following tabs → Community trends',
  },
  {
    id: 'community-new-user',
    flow: 'community',
    title: 'Community as new user',
    path: '/community',
    type: 'Alternate path',
    userType: 'new',
    setup: 'fresh',
    steps: 'View mock public sessions without own profile data',
  },
];

export const MOCK_TEST_VALUES = {
  returningEmail: 'returning.user@example.com',
  returningUsername: 'alex_climber',
  password: 'Password1!',
  takenUsername: 'thegoat',
  invalidVerifyCode: '000000',
  addressSearchHint: 'Montague',
} as const;

export const LOCAL_WEB_BASE = 'http://localhost:8081';

export function scenarioWebLink(path: string) {
  return `${LOCAL_WEB_BASE}${path}`;
}
