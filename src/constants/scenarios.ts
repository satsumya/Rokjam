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
    path: '/dashboard',
    type: 'Happy path',
    steps: 'Dashboard → Start session → Add climbs → End session (private)',
  },
  {
    id: 'rok16-session-no-location',
    ticket: 'ROKJ-16',
    title: 'Start session without profile location',
    path: '/sessions/create',
    type: 'Alternate path',
    steps: 'Add location inline during active session',
  },
  {
    id: 'rok16-session-public',
    ticket: 'ROKJ-16',
    title: 'End session as public without username',
    path: '/sessions/create',
    type: 'Error path',
    steps: 'Choose public → omit username → validation error',
  },
  {
    id: 'rok17-sessions-list',
    ticket: 'ROKJ-17',
    title: 'View all climbing sessions',
    path: '/sessions?demo=seed',
    type: 'Happy path',
    steps: 'Open sessions list → Tap session → View details → Edit',
  },
  {
    id: 'rok17-dashboard-recent',
    ticket: 'ROKJ-17',
    title: 'Dashboard recent vs all toggle',
    path: '/dashboard',
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
