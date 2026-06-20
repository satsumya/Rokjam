export type Scenario = {
  id: string;
  ticket: 'ROKJ-3' | 'ROKJ-15';
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
];

export const LOCAL_WEB_BASE = 'http://localhost:8081';

export function scenarioWebLink(path: string) {
  return `${LOCAL_WEB_BASE}${path}`;
}
