export type Scenario = {
  id: string;
  ticket: 'ROKJ-3' | 'ROKJ-15' | 'ROKJ-16' | 'ROKJ-17' | 'ROKJ-18' | 'ROKJ-22';
  title: string;
  path: string;
  type: 'Happy path' | 'Alternate path' | 'Error path';
  steps: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'rok3-signup-happy',
    ticket: 'ROKJ-3',
    title: 'New user sign up (happy path)',
    path: '/auth/signup',
    type: 'Happy path',
    steps: 'Sign up → Enter verification code → Welcome → Profile setup',
  },
  {
    id: 'rok3-signup-error',
    ticket: 'ROKJ-3',
    title: 'Sign up validation error',
    path: '/auth/signup?demo=error-empty',
    type: 'Error path',
    steps: 'Submit with empty fields to see real-time validation',
  },
  {
    id: 'rok3-signup-existing',
    ticket: 'ROKJ-3',
    title: 'Existing user tries sign up',
    path: '/auth/signup',
    type: 'Alternate path',
    steps: 'Use returning.user@example.com → redirected to login',
  },
  {
    id: 'rok3-verify-error',
    ticket: 'ROKJ-3',
    title: 'Verification code error',
    path: '/auth/verify-email',
    type: 'Error path',
    steps: 'Enter 000000 to see invalid code error',
  },
  {
    id: 'rok3-login-happy',
    ticket: 'ROKJ-3',
    title: 'Returning user login (happy path)',
    path: '/auth/login?demo=prefill',
    type: 'Happy path',
    steps: 'Log in with email or username → Dashboard',
  },
  {
    id: 'rok3-login-error',
    ticket: 'ROKJ-3',
    title: 'Login validation error',
    path: '/auth/login?demo=error-empty',
    type: 'Error path',
    steps: 'Submit with empty fields to see real-time validation',
  },
  {
    id: 'rok3-forgot-password',
    ticket: 'ROKJ-3',
    title: 'Password recovery',
    path: '/auth/forgot-password',
    type: 'Alternate path',
    steps: 'Forgot password → Reset password → Log in',
  },
  {
    id: 'rok3-welcome-skip',
    ticket: 'ROKJ-3',
    title: 'Skip profile from welcome',
    path: '/welcome-signup',
    type: 'Alternate path',
    steps: 'Close or skip welcome → Dashboard prompts profile completion',
  },
  {
    id: 'rok15-profile-happy',
    ticket: 'ROKJ-15',
    title: 'Member profile setup (happy path)',
    path: '/profile/setup',
    type: 'Happy path',
    steps: 'Search location → Add levels → Tags → Complete profile',
  },
  {
    id: 'rok15-profile-minimal',
    ticket: 'ROKJ-15',
    title: 'Exit profile without completing',
    path: '/profile/setup',
    type: 'Alternate path',
    steps: 'Tap Exit or Skip → Dashboard shows complete profile prompt',
  },
  {
    id: 'rok15-profile-error',
    ticket: 'ROKJ-15',
    title: 'Profile completion error',
    path: '/profile/setup?demo=error-no-location',
    type: 'Error path',
    steps: 'Tap Complete profile without adding a location',
  },
  {
    id: 'rok15-username-taken',
    ticket: 'ROKJ-15',
    title: 'Username already taken',
    path: '/profile/setup',
    type: 'Error path',
    steps: 'Enter username "thegoat" to see taken error',
  },
  {
    id: 'rok16-session-happy',
    ticket: 'ROKJ-16',
    title: 'Create climbing session (happy path)',
    path: '/auth/login?demo=prefill',
    type: 'Happy path',
    steps: 'Log in → Complete profile if needed → Dashboard (?demo=session-ready) → Start session → End private',
  },
  {
    id: 'rok16-session-new-user',
    ticket: 'ROKJ-16',
    title: 'New user — no sessions yet',
    path: '/dashboard?demo=new-user',
    type: 'Alternate path',
    steps: 'Dashboard with profile but no logged sessions → Start first session',
  },
  {
    id: 'rok16-session-incomplete-profile',
    ticket: 'ROKJ-16',
    title: 'Incomplete profile — start session anyway',
    path: '/sessions/create',
    type: 'Alternate path',
    steps: 'Start session without full profile → Add location inline when ready',
  },
  {
    id: 'rok16-session-public-username',
    ticket: 'ROKJ-16',
    title: 'Public session username validation',
    path: '/dashboard?demo=session-ready',
    type: 'Error path',
    steps: 'End session as public without profile username → try "thegoat" → validation error',
  },
  {
    id: 'rok17-sessions-list',
    ticket: 'ROKJ-17',
    title: 'View all climbing sessions',
    path: '/dashboard?demo=session-ready',
    type: 'Happy path',
    steps: 'Dashboard with sessions → Full list → View → Edit (add climbs, delete confirm)',
  },
  {
    id: 'rok17-dashboard-recent',
    ticket: 'ROKJ-17',
    title: 'Dashboard recent vs all toggle',
    path: '/dashboard?demo=session-ready',
    type: 'Happy path',
    steps: 'Toggle Recent/All on dashboard → Open session detail',
  },
  {
    id: 'rok18-trends',
    ticket: 'ROKJ-18',
    title: 'Dashboard trends (month default)',
    path: '/dashboard',
    type: 'Happy path',
    steps: 'View trends section → Switch week/month/3 months',
  },
  {
    id: 'rok22-community',
    ticket: 'ROKJ-22',
    title: 'Community public sessions feed',
    path: '/community',
    type: 'Happy path',
    steps: 'View All/Near home/Following tabs → Community trends',
  },
];

export const LOCAL_WEB_BASE = 'http://localhost:8081';

export function scenarioWebLink(path: string) {
  return `${LOCAL_WEB_BASE}${path}`;
}
