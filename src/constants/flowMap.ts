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

export type FlowMapPlacement = {
  /** 1-based step in the journey (left-to-right column). */
  step: number;
  /** Alternate path at that step; 0 when only one path. */
  scenario: number;
  /** Sub-state further in the journey on the same step (e.g. end sheet). */
  substep?: number;
};

export function formatFlowPlacement(placement: FlowMapPlacement) {
  if (placement.substep != null) {
    return `${placement.step}.${placement.scenario}.${placement.substep}`;
  }
  return `${placement.step}.${placement.scenario}`;
}

export function defaultFlowPlacement(
  stepIndex: number,
  nodeIndex: number,
  nodeCount: number,
): FlowMapPlacement {
  return {
    step: stepIndex + 1,
    scenario: nodeCount === 1 ? 0 : nodeIndex + 1,
  };
}

export function compareFlowPlacements(a: FlowMapPlacement, b: FlowMapPlacement) {
  if (a.step !== b.step) return a.step - b.step;
  if (a.scenario !== b.scenario) return a.scenario - b.scenario;
  return (a.substep ?? 0) - (b.substep ?? 0);
}

export type FlowMapScreen = {
  id: string;
  label: string;
  /** Optional descriptors when variants share the same label (shown in display name and download filename). */
  descriptors?: string[];
  /** Bracketed tag in download filename only, e.g. End → [End]- (also shown in display name). */
  downloadTag?: string;
  /** Override descriptor segments in the download filename when they differ from display. */
  downloadDescriptors?: string[];
  path: string;
  setup: ScenarioSetup;
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
  placement: FlowMapPlacement;
};

export type FlowMapLayoutStep = {
  /** Screens at the same journey stage — stacked vertically when there are alternates */
  nodes: {
    nodeId: string;
    screenId: string;
    subtitle?: string;
    placement?: FlowMapPlacement;
  }[];
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
/** Fallback frame height when a screen has no PNG dimensions yet. */
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
    path: '/',
    setup: 'fresh',
  },
  signup: {
    id: 'signup',
    label: 'Sign up',
    path: '/auth/signup',
    setup: 'fresh',
  },
  'verify-email': {
    id: 'verify-email',
    label: 'Verify email',
    path: '/auth/verify-email?demo=prefill',
    setup: 'fresh',
    beforeNavigate: ({ setEmail }) => setEmail('new.user@example.com'),
  },
  'welcome-signup': {
    id: 'welcome-signup',
    label: 'Welcome',
    descriptors: ['Post sign-up'],
    path: '/welcome-signup',
    setup: 'fresh',
    beforeNavigate: ({ setEmail }) => setEmail('new.user@example.com'),
  },
  login: {
    id: 'login',
    label: 'Log in',
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
    path: '/profile/setup',
    setup: 'fresh',
  },
  'dashboard-new': {
    id: 'dashboard-new',
    label: 'Dashboard',
    descriptors: ['Blank profile', 'No climbs'],
    path: '/dashboard?demo=profile-incomplete',
    setup: 'fresh',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('profile-incomplete'),
  },
  'dashboard-profile-ready': {
    id: 'dashboard-profile-ready',
    label: 'Dashboard',
    descriptors: ['Profile complete', 'No sessions'],
    path: '/dashboard?demo=profile-ready',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('profile-ready'),
  },
  'dashboard-returning': {
    id: 'dashboard-returning',
    label: 'Dashboard',
    descriptors: ['With sessions'],
    path: '/dashboard?demo=session-ready',
    setup: 'returning',
  },
  'dashboard-trends': {
    id: 'dashboard-trends',
    label: 'Insights',
    descriptors: ['Trends'],
    path: '/insights?demo=seed',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('dashboard-many-sessions'),
  },
  'dashboard-one-session': {
    id: 'dashboard-one-session',
    label: 'Dashboard',
    descriptors: ['One session'],
    path: '/dashboard?demo=one-session',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('dashboard-one-session'),
  },
  'dashboard-many-sessions': {
    id: 'dashboard-many-sessions',
    label: 'Dashboard',
    descriptors: ['Many sessions'],
    path: '/dashboard?demo=many-sessions',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('dashboard-many-sessions'),
  },
  'dashboard-mid-session': {
    id: 'dashboard-mid-session',
    label: 'Dashboard',
    descriptors: ['Mid-session'],
    path: '/dashboard?demo=mid-session',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('dashboard-mid-session'),
  },
  'active-session': {
    id: 'active-session',
    label: 'Active session',
    path: '/sessions/demo-active-session/active?demo=active',
    setup: 'returning',
    beforeNavigate: ({ seedDemoActiveSession }) => seedDemoActiveSession(),
  },
  'active-session-empty': {
    id: 'active-session-empty',
    label: 'Active session',
    descriptors: ['Empty'],
    path: '/sessions/demo-flow-session/active?demo=flow-empty',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-empty'),
  },
  'active-session-empty-incomplete': {
    id: 'active-session-empty-incomplete',
    label: 'Active session',
    descriptors: ['Empty', 'Profile incomplete'],
    path: '/sessions/demo-flow-session/active?demo=flow-empty-incomplete',
    setup: 'fresh',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-empty-incomplete'),
  },
  'active-session-adding-climb': {
    id: 'active-session-adding-climb',
    label: 'Active session',
    descriptors: ['Add climb'],
    path: '/sessions/demo-flow-session/active?demo=flow-adding',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-adding'),
  },
  'active-session-multi-climbs': {
    id: 'active-session-multi-climbs',
    label: 'Active session',
    descriptors: ['Multiple climbs'],
    path: '/sessions/demo-flow-session/active?demo=flow-multi',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-multi'),
  },
  'active-session-end-sheet': {
    id: 'active-session-end-sheet',
    label: 'Active session',
    downloadTag: 'End',
    path: '/sessions/demo-flow-session/active?demo=flow-end-sheet',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-end-sheet'),
  },
  'active-session-end-sheet-filled': {
    id: 'active-session-end-sheet-filled',
    label: 'Active session',
    downloadTag: 'End',
    descriptors: ['End time set'],
    path: '/sessions/demo-flow-session/active?demo=flow-end-sheet-filled',
    setup: 'returning',
    beforeNavigate: ({ seedFlowDemo }) => seedFlowDemo('active-end-sheet-filled'),
  },
  'sessions-list': {
    id: 'sessions-list',
    label: 'All sessions',
    path: '/sessions?demo=seed',
    setup: 'returning',
  },
  'session-detail': {
    id: 'session-detail',
    label: 'Session detail',
    path: '/sessions/demo-session-1?demo=seed',
    setup: 'returning',
  },
  'session-edit': {
    id: 'session-edit',
    label: 'Edit session',
    path: '/sessions/demo-session-1/edit?demo=seed',
    setup: 'returning',
  },
  community: {
    id: 'community',
    label: 'Community',
    path: '/community',
    setup: 'returning',
  },
  'community-fresh': {
    id: 'community-fresh',
    label: 'Community',
    descriptors: ['New user'],
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
          { nodeId: 'welcome-after', screenId: 'welcome-signup', placement: { step: 4, scenario: 1 } },
          { nodeId: 'reset', screenId: 'reset-password', placement: { step: 4, scenario: 3 } },
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
      { from: 'from-dash', to: 'profile', label: 'Go to dashboard' },
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
          { nodeId: 'dash-ready', screenId: 'dashboard-profile-ready', placement: { step: 1, scenario: 1 } },
          { nodeId: 'dash-incomplete', screenId: 'dashboard-new', placement: { step: 1, scenario: 2 } },
        ],
      },
      {
        nodes: [
          { nodeId: 'active-empty', screenId: 'active-session-empty', placement: { step: 2, scenario: 1 } },
          {
            nodeId: 'active-empty-inc',
            screenId: 'active-session-empty-incomplete',
            placement: { step: 2, scenario: 2 },
          },
        ],
      },
      {
        nodes: [
          { nodeId: 'adding', screenId: 'active-session-adding-climb', placement: { step: 3, scenario: 0 } },
        ],
      },
      {
        nodes: [
          { nodeId: 'multi', screenId: 'active-session-multi-climbs', placement: { step: 4, scenario: 0 } },
        ],
      },
      {
        nodes: [
          {
            nodeId: 'end-empty',
            screenId: 'active-session-end-sheet',
            placement: { step: 4, scenario: 0, substep: 1 },
          },
          {
            nodeId: 'end-filled',
            screenId: 'active-session-end-sheet-filled',
            placement: { step: 4, scenario: 0, substep: 2 },
          },
          { nodeId: 'dash-mid', screenId: 'dashboard-mid-session', placement: { step: 5, scenario: 3 } },
        ],
      },
      {
        nodes: [
          { nodeId: 'dash-one', screenId: 'dashboard-one-session', placement: { step: 5, scenario: 1 } },
          { nodeId: 'dash-many', screenId: 'dashboard-many-sessions', placement: { step: 5, scenario: 2 } },
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
    description:
      'Home with a complete profile (no sessions yet), and Insights after sessions are logged.',
    steps: [
      {
        nodes: [
          { nodeId: 'with-data', screenId: 'dashboard-trends', placement: { step: 1, scenario: 1 } },
          {
            nodeId: 'empty',
            screenId: 'dashboard-profile-ready',
            placement: { step: 1, scenario: 2 },
          },
        ],
      },
    ],
    edges: [],
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

export function resolveJourneyLayout(
  journey: FlowMapJourney,
  extraDimensions?: Record<string, { width: number; height: number }>,
): FlowMapLayoutNode[] {
  const nodes: FlowMapLayoutNode[] = [];
  let stepX = 0;

  for (const [stepIndex, step] of journey.steps.entries()) {
    let stepY = 0;
    const nodeCount = step.nodes.length;

    for (const [nodeIndex, slot] of step.nodes.entries()) {
      const frameHeight = frameHeightForScreen(
        slot.screenId,
        FLOW_NODE_WIDTH,
        FLOW_FRAME_MIN_HEIGHT,
        extraDimensions,
      );
      nodes.push({
        nodeId: slot.nodeId,
        screenId: slot.screenId,
        x: stepX,
        y: stepY,
        frameHeight,
        subtitle: slot.subtitle,
        placement: slot.placement ?? defaultFlowPlacement(stepIndex, nodeIndex, nodeCount),
      });
      stepY += nodeTotalHeight(frameHeight) + FLOW_BRANCH_GAP;
    }

    stepX += FLOW_NODE_WIDTH + FLOW_STEP_GAP;
  }

  return nodes;
}

export function journeyCanvasSize(
  journey: FlowMapJourney,
  extraDimensions?: Record<string, { width: number; height: number }>,
) {
  const pad = 48;
  const nodes = resolveJourneyLayout(journey, extraDimensions);
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
