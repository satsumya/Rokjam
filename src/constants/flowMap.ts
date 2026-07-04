import type { ScenarioFlow, ScenarioSetup } from './scenarios';
import { SCENARIO_FLOWS } from './scenarios';
import { frameHeightForScreen } from './flowScreenDimensions';

export type FlowNavigateContext = {
  resetSession: () => void;
  seedReturningUser: () => void;
  seedDemoProfileOnly: () => void;
  seedDemoSessions: () => void;
  seedDemoActiveSession: () => void;
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

export type FlowMapLayoutRow = {
  nodes: { nodeId: string; screenId: string; x: number; subtitle?: string }[];
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
  rows: FlowMapLayoutRow[];
  edges: FlowMapLayoutEdge[];
};

export const FLOW_NODE_WIDTH = 360;
export const FLOW_FRAME_MIN_HEIGHT = 780;
export const FLOW_LABEL_HEIGHT = 56;
export const FLOW_ROW_GAP = 80;

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
    subtitle: 'Profile incomplete prompt',
    path: '/dashboard?demo=new-user',
    setup: 'profile-only',
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
  'active-session': {
    id: 'active-session',
    label: 'Active session',
    subtitle: 'Log climbs, save/end',
    path: '/sessions/demo-active-session/active?demo=active',
    setup: 'returning',
    beforeNavigate: ({ seedDemoActiveSession }) => seedDemoActiveSession(),
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
    rows: [
      { nodes: [{ nodeId: 'welcome', screenId: 'welcome', x: 760 }] },
      {
        nodes: [
          { nodeId: 'signup', screenId: 'signup', x: 80 },
          { nodeId: 'login', screenId: 'login', x: 920 },
          { nodeId: 'forgot', screenId: 'forgot-password', x: 1760 },
        ],
      },
      {
        nodes: [
          { nodeId: 'verify', screenId: 'verify-email', x: 80 },
          { nodeId: 'dash-login', screenId: 'dashboard-returning', x: 920 },
          { nodeId: 'reset', screenId: 'reset-password', x: 1760 },
        ],
      },
      { nodes: [{ nodeId: 'welcome-after', screenId: 'welcome-signup', x: 80 }] },
      {
        nodes: [
          { nodeId: 'profile', screenId: 'profile-setup', x: 0 },
          { nodeId: 'dash-skip', screenId: 'dashboard-new', x: 720 },
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
    rows: [
      {
        nodes: [
          { nodeId: 'from-welcome', screenId: 'welcome-signup', x: 80 },
          { nodeId: 'from-dash', screenId: 'dashboard-new', x: 920 },
        ],
      },
      { nodes: [{ nodeId: 'profile', screenId: 'profile-setup', x: 500 }] },
      { nodes: [{ nodeId: 'done', screenId: 'dashboard-returning', x: 500 }] },
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
    description: 'Start, log climbs during, and end a climbing session.',
    rows: [
      { nodes: [{ nodeId: 'home', screenId: 'dashboard-returning', x: 500 }] },
      { nodes: [{ nodeId: 'active', screenId: 'active-session', x: 500 }] },
      { nodes: [{ nodeId: 'home-end', screenId: 'dashboard-returning', x: 500 }] },
    ],
    edges: [
      { from: 'home', to: 'active', label: 'Start session' },
      { from: 'active', to: 'home-end', label: 'Save / end session' },
    ],
  },
  {
    id: 'session-view-edit',
    title: SCENARIO_FLOWS.find((f) => f.id === 'session-view-edit')!.doc,
    description: 'Browse sessions from dashboard or full list, view and edit details.',
    rows: [
      {
        nodes: [
          { nodeId: 'home', screenId: 'dashboard-returning', x: 0 },
          { nodeId: 'list', screenId: 'sessions-list', x: 720 },
        ],
      },
      {
        nodes: [
          { nodeId: 'detail', screenId: 'session-detail', x: 360 },
          { nodeId: 'edit', screenId: 'session-edit', x: 1080 },
        ],
      },
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
    rows: [
      {
        nodes: [
          { nodeId: 'with-data', screenId: 'dashboard-trends', x: 80 },
          { nodeId: 'empty', screenId: 'dashboard-new', x: 920 },
        ],
      },
    ],
    edges: [{ from: 'empty', to: 'with-data', label: 'After first sessions logged' }],
  },
  {
    id: 'community',
    title: SCENARIO_FLOWS.find((f) => f.id === 'community')!.doc,
    description: 'Public sessions feed — all, near home, and following.',
    rows: [
      {
        nodes: [
          { nodeId: 'home', screenId: 'dashboard-returning', x: 80 },
          { nodeId: 'feed', screenId: 'community', x: 920 },
        ],
      },
    ],
    edges: [{ from: 'home', to: 'feed', label: 'Open community' }],
  },
];

export function resolveJourneyLayout(journey: FlowMapJourney): FlowMapLayoutNode[] {
  const nodes: FlowMapLayoutNode[] = [];
  let y = 0;

  for (const row of journey.rows) {
    let rowFrameHeight = 0;
    for (const slot of row.nodes) {
      const frameHeight = frameHeightForScreen(
        slot.screenId,
        FLOW_NODE_WIDTH,
        FLOW_FRAME_MIN_HEIGHT,
      );
      rowFrameHeight = Math.max(rowFrameHeight, frameHeight);
      nodes.push({
        nodeId: slot.nodeId,
        screenId: slot.screenId,
        x: slot.x,
        y,
        frameHeight,
        subtitle: slot.subtitle,
      });
    }
    y += rowFrameHeight + FLOW_LABEL_HEIGHT + FLOW_ROW_GAP;
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
