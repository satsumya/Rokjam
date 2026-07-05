import { DEFAULT_LEVEL_COLORS, PET_ROCK_AVATARS } from './difficultyLevels';
import type { ClimbingSession, SessionClimb } from '../types/climbingSession';
import { createDemoSessions } from './mockSessions';
import { todayIso } from '../utils/sessionUtils';

export const FLOW_DEMO_SESSION_ID = 'demo-flow-session';

export type FlowDemoPreset =
  | 'profile-ready'
  | 'profile-incomplete'
  | 'active-empty'
  | 'active-empty-incomplete'
  | 'active-adding'
  | 'active-multi'
  | 'active-end-sheet'
  | 'active-end-sheet-filled'
  | 'dashboard-one-session'
  | 'dashboard-many-sessions'
  | 'dashboard-mid-session';

const levels = DEFAULT_LEVEL_COLORS.slice(0, 5);

function baseActiveSession(climbs: SessionClimb[], locationId: string, locationName: string): ClimbingSession {
  return {
    id: FLOW_DEMO_SESSION_ID,
    status: 'active',
    date: todayIso(),
    startTime: '5:30 PM',
    locationId,
    locationName,
    isPublic: false,
    ownerUsername: 'alex_climber',
    ownerAvatar: PET_ROCK_AVATARS[0],
    climbs,
  };
}

export function createFlowMultiClimbs(): SessionClimb[] {
  return [
    {
      id: 'fc1',
      levelId: 'demo-level-1',
      levelName: levels[1].name,
      levelColor: levels[1].color,
      name: 'Blue slab',
      tags: ['slab', 'balance'],
      notes: 'Footwork focus',
      hasImage: false,
      hasVideo: false,
      isWarmUp: true,
      isRepeat: false,
      isProject: false,
      attempts: [{ id: 'fa1', progress: ['send'] }],
    },
    {
      id: 'fc2',
      tags: ['dyno', 'campus-style'],
      name: 'Roof dyno',
      notes: '',
      hasImage: true,
      hasVideo: false,
      isWarmUp: false,
      isRepeat: false,
      isProject: false,
      attempts: [
        { id: 'fa2', progress: ['start'] },
        { id: 'fa3', progress: ['middle', 'end'] },
        { id: 'fa4', progress: ['send'] },
      ],
    },
    {
      id: 'fc3',
      attempts: [{ id: 'fa5', progress: [] }],
      tags: [],
      hasImage: false,
      hasVideo: false,
      isWarmUp: false,
      isRepeat: false,
      isProject: false,
    },
    {
      id: 'fc4',
      levelId: 'demo-level-3',
      levelName: levels[3].name,
      levelColor: levels[3].color,
      name: 'Orange project',
      tags: ['crimpy', 'technical'],
      notes: 'Hip tension',
      hasImage: false,
      hasVideo: true,
      isWarmUp: false,
      isRepeat: true,
      isProject: true,
      attempts: [
        { id: 'fa6', progress: ['start'] },
        { id: 'fa7', progress: ['middle'] },
      ],
    },
    {
      id: 'fc5',
      levelId: 'demo-level-2',
      levelName: levels[2].name,
      levelColor: levels[2].color,
      name: 'Comp wall',
      tags: [],
      notes: '',
      hasImage: false,
      hasVideo: false,
      isWarmUp: false,
      isRepeat: false,
      isProject: false,
      attempts: [{ id: 'fa8', progress: ['flash'] }],
    },
    {
      id: 'fc6',
      levelId: 'demo-level-4',
      levelName: levels[4].name,
      levelColor: levels[4].color,
      tags: ['overhang', 'power', 'shoulder-y'],
      name: 'Steep cave',
      notes: '',
      hasImage: false,
      hasVideo: false,
      isWarmUp: false,
      isRepeat: false,
      isProject: false,
      attempts: [{ id: 'fa9', progress: ['start', 'middle'] }],
    },
    {
      id: 'fc7',
      name: 'Yellow traverse',
      tags: ['balance'],
      hasImage: false,
      hasVideo: false,
      isWarmUp: false,
      isRepeat: false,
      isProject: false,
      attempts: [{ id: 'fa10', progress: ['send'] }],
    },
    {
      id: 'fc8',
      levelId: 'demo-level-0',
      levelName: levels[0].name,
      levelColor: levels[0].color,
      name: 'Green warmup',
      tags: ['slab'],
      hasImage: false,
      hasVideo: false,
      isWarmUp: true,
      isRepeat: false,
      isProject: false,
      attempts: [{ id: 'fa11', progress: ['send'] }],
    },
  ];
}

export function createFlowManySessions(homeLocationId: string, homeLocationName: string): ClimbingSession[] {
  const base = createDemoSessions(homeLocationId, homeLocationName);
  const extra: ClimbingSession[] = [];

  for (let i = 3; i <= 14; i += 1) {
    const day = String(10 + (i % 20)).padStart(2, '0');
    const month = i % 2 === 0 ? '05' : '06';
    extra.push({
      id: `demo-session-${i}`,
      status: 'completed',
      date: `2026-${month}-${day}`,
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      durationMinutes: 120,
      locationId: homeLocationId,
      locationName: homeLocationName,
      isPublic: i % 4 === 0,
      ownerUsername: 'alex_climber',
      ownerAvatar: PET_ROCK_AVATARS[0],
      climbs: [
        {
          id: `c-${i}-1`,
          levelId: 'demo-level-1',
          levelName: levels[1].name,
          levelColor: levels[1].color,
          name: `Session ${i} climb`,
          tags: i % 3 === 0 ? ['dyno'] : ['slab'],
          notes: '',
          hasImage: false,
          hasVideo: false,
          isWarmUp: false,
          isRepeat: false,
          isProject: false,
          attempts: [{ id: `a-${i}-1`, progress: ['send'] }],
        },
      ],
    });
  }

  return [...base, ...extra];
}

export function flowDemoNeedsActiveSession(preset: FlowDemoPreset) {
  return preset.startsWith('active-') || preset === 'dashboard-mid-session';
}

export function buildFlowDemoSession(
  preset: FlowDemoPreset,
  locationId: string,
  locationName: string,
): ClimbingSession | null {
  if (!flowDemoNeedsActiveSession(preset)) return null;

  if (preset === 'active-empty' || preset === 'active-empty-incomplete' || preset === 'active-adding') {
    return baseActiveSession([], locationId, locationName);
  }

  if (preset === 'active-multi' || preset === 'active-end-sheet' || preset === 'active-end-sheet-filled') {
    return baseActiveSession(createFlowMultiClimbs(), locationId, locationName);
  }

  if (preset === 'dashboard-mid-session') {
    return baseActiveSession(createFlowMultiClimbs().slice(0, 3), locationId, locationName);
  }

  return null;
}
