import type { ScenarioFlow, ScenarioSetup } from './scenarios';
import { SCENARIO_FLOWS } from './scenarios';
import type { FlowDemoPreset } from './flowDemoSessions';
import { frameHeightForScreen } from './flowScreenDimensions';

export type FlowNavigateContext = {
  resetSession: () => void;
  seedReturningUser: () => void;
  seedDemoProfileOnly: () => void;
  seedDemoSessions: () => void;
  seedDemoActiveSession: () => void;
  seedFlowDemo: (preset: FlowDemoPreset) => void;
  setEmail: (value: string) => void;
};

export type FlowMapScreen = {
  id: string;
  label: string;
  path: string;
  setup: ScenarioSetup;
  subtitle?: string;
  beforeNavigate?: (ctx: FlowNavigateContext) => void;
};

export type FlowMapLayoutNode = {
  /** Unique key within the journey canvas */
  nodeId: string;
  screenId: string;
  x: number;
  y: number;
  frameHeight: number;
  subtitle?: string;
};

export type FlowMapLayoutStep = {
  /** Screens at the same journey stage — stacked vertically when there are alternates */
  nodes: { nodeId: string; screenId: string; subtitle?: string }[];
};

export type FlowMapLayoutEdge = {
  from: string;
  to: string;
  label: string;
};

export type FlowMapJourney = {
  id: ScenarioFlow;
  title: string;
  description: string;
  /** Left-to-right journey stages */
  steps: FlowMapLayoutStep[];
  edges: FlowMapLayoutEdge[];
};

export const FLOW_NODE_WIDTH = 360;
export const FLOW_FRAME_MIN_HEIGHT = 780;
export const FLOW_LABEL_HEIGHT = 76;
/** Horizontal gap between journey steps */
export const FLOW_STEP_GAP = 100;
/** Vertical gap between alternate paths within one step */
export const FLOW_BRANCH_GAP = 48;

export function nodeTotalHeight(frameHeight: number) {
  return frameHeight + FLOW_LABEL_HEIGHT;
}

export const FLOW_MAP_SCREENS: Record<string, FlowMapScreen> = {
  welcome: {
    id: 'welcome',
    label: 'Welcome',
    subtitle: 'Entry point',
    path: '/',
    setup: 'fresh',
  },
  signup: {
    id: 'signup',
    label: 'Sign up',
    subtitle: 'Email, password, validation',
    path: '/auth/signup',
    setup: 'fresh',
  },
  'verify-email': {
    id: 'verify-email',
    label: 'Verify email',
    subtitle: '6-digit code',
    path: '/auth/verify-email?demo=prefill',
    setup: 'fresh',
    beforeNavigate: ({ setEmail }) => setEmail('new.user@example.com'),
  },
  'welcome-signup': {
    id: 'welcome-signup',
    label: 'Welcome',
    subtitle: 'Post sign-up',
    path: '/welcome-signup',
    setup: 'fresh',
    beforeNavigate: ({ setEmail }) => setEmail('new.user@example.com'),
  },
  login: {
    id: 'login',
    label: 'Log in',
    subtitle: 'Email or username',
    path: '/auth/login?demo=prefill',
    setup: 'fresh',
  },
  'forgot-password': {
    id: 'forgot-password',
    label: 'Forgot password',
    path: '/auth/forgot-password',
    setup: 'fresh',
  },
  'reset-password': {
    id: 'reset-password',
    label: 'Reset password',
    path: '/auth/reset-password',
    setup: 'fresh',
  },
  'profile-setup': {
    id: 'profile-setup',
    label: 'Profile setup',
    subtitle: 'Location, levels, tags',
    path: '/profile/setup',
    setup: 'fresh',
  },
  'dashboard-new': {
    id: 'dashboard-new',
    label: 'Dashboard',
    subtitle: 'Profile incomplete · no sessions',
    path: '/dashboard?demo=profile-incomplete',
    setup: 'fresh',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('profile-incomplete'),
  },
  'dashboard-profile-ready': {
    id: 'dashboard-profile-ready',
    label: 'Dashboard',
    subtitle: 'Profile complete · no sessions',
    path: '/dashboard?demo=profile-ready',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('profile-ready'),
  },
  'dashboard-returning': {
    id: 'dashboard-returning',
    label: 'Dashboard',
    subtitle: 'Home · sessions & trends',
    path: '/dashboard?demo=session-ready',
    setup: 'returning',
  },
  'dashboard-trends': {
    id: 'dashboard-trends',
    label: 'Dashboard',
    subtitle: 'Trends & standouts',
    path: '/dashboard?demo=seed',
    setup: 'returning',
  },
  'dashboard-one-session': {
    id: 'dashboard-one-session',
    label: 'Dashboard',
    subtitle: 'After first session saved',
    path: '/dashboard?demo=one-session',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('dashboard-one-session'),
  },
  'dashboard-many-sessions': {
    id: 'dashboard-many-sessions',
    label: 'Dashboard',
    subtitle: 'Many sessions logged',
    path: '/dashboard?demo=many-sessions',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('dashboard-many-sessions'),
  },
  'dashboard-mid-session': {
    id: 'dashboard-mid-session',
    label: 'Dashboard',
    subtitle: 'Session in progress',
    path: '/dashboard?demo=mid-session',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('dashboard-mid-session'),
  },
  'active-session': {
    id: 'active-session',
    label: 'Active session',
    subtitle: 'Log climbs, save/end',
    path: '/sessions/demo-active-session/active?demo=active',
    setup: 'returning',
    beforeNavigate: ({ seedDemoActiveSession }) => seedDemoActiveSession(),
  },
  'active-session-empty': {
    id: 'active-session-empty',
    label: 'Active session',
    subtitle: 'Initial state · profile complete',
    path: '/sessions/demo-flow-session/active?demo=flow-empty',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-empty'),
  },
  'active-session-empty-incomplete': {
    id: 'active-session-empty-incomplete',
    label: 'Active session',
    subtitle: 'Initial state · profile incomplete',
    path: '/sessions/demo-flow-session/active?demo=flow-empty-incomplete',
    setup: 'fresh',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-empty-incomplete'),
  },
  'active-session-adding-climb': {
    id: 'active-session-adding-climb',
    label: 'Active session',
    subtitle: 'Adding a climb',
    path: '/sessions/demo-flow-session/active?demo=flow-adding',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-adding'),
  },
  'active-session-multi-climbs': {
    id: 'active-session-multi-climbs',
    label: 'Active session',
    subtitle: 'Multiple climbs · sort & filter',
    path: '/sessions/demo-flow-session/active?demo=flow-multi',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-multi'),
  },
  'active-session-end-sheet': {
    id: 'active-session-end-sheet',
    label: 'Save / end session',
    subtitle: 'End time defaults to now',
    path: '/sessions/demo-flow-session/active?demo=flow-end-sheet',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-end-sheet'),
  },
  'active-session-end-sheet-filled': {
    id: 'active-session-end-sheet-filled',
    label: 'Save / end session',
    subtitle: 'End time & duration set',
    path: '/sessions/demo-flow-session/active?demo=flow-end-sheet-filled',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-end-sheet-filled'),
  },
  'sessions-list': {
    id: 'sessions-list',
    label: 'All sessions',
    subtitle: 'Full session history',
    path: '/sessions?demo=seed',
    setup: 'returning',
  },
  'session-detail': {
    id: 'session-detail',
    label: 'Session detail',
    subtitle: 'View climbs & share',
    path: '/sessions/demo-session-1?demo=seed',
    setup: 'returning',
  },
  'session-edit': {
    id: 'session-edit',
    label: 'Edit session',
    subtitle: 'Update climbs & settings',
    path: '/sessions/demo-session-1/edit?demo=seed',
    setup: 'returning',
  },
  community: {
    id: 'community',
    label: 'Community',
    subtitle: 'Public sessions feed',
    path: '/community',
    setup: 'returning',
  },
  'community-fresh': {
    id: 'community-fresh',
    label: 'Community',
    subtitle: 'View as new user',
    path: '/community',
    setup: 'fresh',
  },
};

export const FLOW_MAP_JOURNEYS: FlowMapJourney[] = [
  {
    id: 'sign-up-login',
    title: SCENARIO_FLOWS.find((f) => f.id === 'sign-up-login')!.doc,
    description: 'New user sign-up, returning login, and password recovery.',
    steps: [
      { nodes: [{ nodeId: 'welcome', screenId: 'welcome' }] },
      {
        nodes: [
          { nodeId: 'signup', screenId: 'signup' },
          { nodeId: 'login', screenId: 'login' },
        ],
      },
      {
        nodes: [
          { nodeId: 'verify', screenId: 'verify-email' },
          { nodeId: 'dash-login', screenId: 'dashboard-returning' },
          { nodeId: 'forgot', screenId: 'forgot-password' },
        ],
      },
      {
        nodes: [
          { nodeId: 'welcome-after', screenId: 'welcome-signup' },
          { nodeId: 'reset', screenId: 'reset-password' },
        ],
      },
      {
        nodes: [
          { nodeId: 'profile', screenId: 'profile-setup' },
          { nodeId: 'dash-skip', screenId: 'dashboard-new' },
        ],
      },
    ],
    edges: [
      { from: 'welcome', to: 'signup', label: 'Sign up' },
      { from: 'welcome', to: 'login', label: 'Log in' },
      { from: 'signup', to: 'verify', label: 'Create account' },
      { from: 'verify', to: 'welcome-after', label: 'Verify code' },
      { from: 'welcome-after', to: 'profile', label: 'Create profile' },
      { from: 'welcome-after', to: 'dash-skip', label: 'Skip for now' },
      { from: 'login', to: 'dash-login', label: 'Log in' },
      { from: 'login', to: 'forgot', label: 'Forgot password' },
      { from: 'forgot', to: 'reset', label: 'Send reset link' },
    ],
  },
  {
    id: 'member-profile',
    title: SCENARIO_FLOWS.find((f) => f.id === 'member-profile')!.doc,
    description: 'Member profile setup after sign-up or from dashboard prompt.',
    steps: [
      {
        nodes: [
          { nodeId: 'from-welcome', screenId: 'welcome-signup' },
          { nodeId: 'from-dash', screenId: 'dashboard-new' },
        ],
      },
      { nodes: [{ nodeId: 'profile', screenId: 'profile-setup' }] },
      { nodes: [{ nodeId: 'done', screenId: 'dashboard-returning' }] },
    ],
    edges: [
      { from: 'from-welcome', to: 'profile', label: 'Create profile' },
      { from: 'from-dash', to: 'profile', label: 'Complete profile' },
      { from: 'profile', to: 'done', label: 'Save profile' },
    ],
  },
  {
    id: 'session-create',
    title: SCENARIO_FLOWS.find((f) => f.id === 'session-create')!.doc,
    description:
      'Start a session from the dashboard, log climbs with varied detail, save/end, and return home — including exiting mid-session.',
    steps: [
      {
        nodes: [
          { nodeId: 'dash-ready', screenId: 'dashboard-profile-ready' },
          { nodeId: 'dash-incomplete', screenId: 'dashboard-new' },
        ],
      },
      {
        nodes: [
          { nodeId: 'active-empty', screenId: 'active-session-empty' },
          { nodeId: 'active-empty-inc', screenId: 'active-session-empty-incomplete' },
        ],
      },
      { nodes: [{ nodeId: 'adding', screenId: 'active-session-adding-climb' }] },
      { nodes: [{ nodeId: 'multi', screenId: 'active-session-multi-climbs' }] },
      {
        nodes: [
          { nodeId: 'end-empty', screenId: 'active-session-end-sheet' },
          { nodeId: 'end-filled', screenId: 'active-session-end-sheet-filled' },
          { nodeId: 'dash-mid', screenId: 'dashboard-mid-session' },
        ],
      },
      {
        nodes: [
          { nodeId: 'dash-one', screenId: 'dashboard-one-session' },
          { nodeId: 'dash-many', screenId: 'dashboard-many-sessions' },
        ],
      },
    ],
    edges: [
      { from: 'dash-ready', to: 'active-empty', label: 'Start session' },
      { from: 'dash-incomplete', to: 'active-empty-inc', label: 'Start session' },
      { from: 'active-empty', to: 'adding', label: 'Add climb' },
      { from: 'active-empty-inc', to: 'adding', label: 'Add climb' },
      { from: 'adding', to: 'multi', label: 'Save climb' },
      { from: 'multi', to: 'end-empty', label: 'Save / end session' },
      { from: 'multi', to: 'end-filled', label: 'Save / end session' },
      { from: 'multi', to: 'dash-mid', label: 'Dashboard (mid-session)' },
      { from: 'end-empty', to: 'dash-one', label: 'Confirm and save' },
      { from: 'end-filled', to: 'dash-one', label: 'Confirm and save' },
      { from: 'dash-one', to: 'dash-many', label: 'After more sessions' },
    ],
  },
  {
    id: 'session-view-edit',
    title: SCENARIO_FLOWS.find((f) => f.id === 'session-view-edit')!.doc,
    description: 'Browse sessions from dashboard or full list, view and edit details.',
    steps: [
      {
        nodes: [
          { nodeId: 'home', screenId: 'dashboard-returning' },
          { nodeId: 'list', screenId: 'sessions-list' },
        ],
      },
      { nodes: [{ nodeId: 'detail', screenId: 'session-detail' }] },
      { nodes: [{ nodeId: 'edit', screenId: 'session-edit' }] },
    ],
    edges: [
      { from: 'home', to: 'list', label: 'View all sessions' },
      { from: 'home', to: 'detail', label: 'Open recent session' },
      { from: 'list', to: 'detail', label: 'Select session' },
      { from: 'detail', to: 'edit', label: 'Edit session' },
    ],
  },
  {
    id: 'dashboard',
    title: SCENARIO_FLOWS.find((f) => f.id === 'dashboard')!.doc,
    description: 'Trends and standout stats on the dashboard home.',
    steps: [
      { nodes: [{ nodeId: 'empty', screenId: 'dashboard-profile-ready' }] },
      { nodes: [{ nodeId: 'with-data', screenId: 'dashboard-trends' }] },
    ],
    edges: [{ from: 'empty', to: 'with-data', label: 'After first sessions logged' }],
  },
  {
    id: 'community',
    title: SCENARIO_FLOWS.find((f) => f.id === 'community')!.doc,
    description: 'Public sessions feed — all, near home, and following.',
    steps: [
      { nodes: [{ nodeId: 'home', screenId: 'dashboard-returning' }] },
      { nodes: [{ nodeId: 'feed', screenId: 'community' }] },
    ],
    edges: [{ from: 'home', to: 'feed', label: 'Open community' }],
  },
];

export function resolveJourneyLayout(journey: FlowMapJourney): FlowMapLayoutNode[] {
  const nodes: FlowMapLayoutNode[] = [];
  let stepX = 0;

  for (const step of journey.steps) {
    let stepY = 0;

    for (const slot of step.nodes) {
      const frameHeight = frameHeightForScreen(
        slot.screenId,
        FLOW_NODE_WIDTH,
        FLOW_FRAME_MIN_HEIGHT,
      );
      nodes.push({
        nodeId: slot.nodeId,
        screenId: slot.screenId,
        x: stepX,
        y: stepY,
        frameHeight,
        subtitle: slot.subtitle,
      });
      stepY += nodeTotalHeight(frameHeight) + FLOW_BRANCH_GAP;
    }

    stepX += FLOW_NODE_WIDTH + FLOW_STEP_GAP;
  }

  return nodes;
}

export function journeyCanvasSize(journey: FlowMapJourney) {
  const pad = 48;
  const nodes = resolveJourneyLayout(journey);
  let maxX = 0;
  let maxY = 0;
  for (const node of nodes) {
    maxX = Math.max(maxX, node.x + FLOW_NODE_WIDTH);
    maxY = Math.max(maxY, node.y + nodeTotalHeight(node.frameHeight));
  }
  return { width: maxX + pad, height: maxY + pad, nodes };
}

/** Unique screen ids referenced in a journey (for bulk download). */
export function journeyScreenIds(journey: FlowMapJourney): string[] {
  const ids = new Set<string>();
  for (const step of journey.steps) {
    for (const node of step.nodes) {
      ids.add(node.screenId);
    }
  }
  return [...ids];
}
