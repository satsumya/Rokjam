import { DEFAULT_LEVEL_COLORS, PET_ROCK_AVATARS } from './difficultyLevels';
import type { ClimbingSession, SessionClimb } from '../types/climbingSession';
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

type DemoLevel = { id: string; name: string; color: string };
type DemoLocationRef = {
  id: string;
  name: string;
  levels: DemoLevel[];
};

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

const SESSION_DURATIONS_MIN = [45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210] as const;
const CLIMB_NAMES = [
  'Slab warmup',
  'Corner crack',
  'Roof dyno',
  'Comp wall',
  'Arete project',
  'Volume boulder',
  'Traverse',
  'Crimpy rail',
  'Overhang prow',
  'Balance board',
  'Campus board',
  'Pinch ladder',
] as const;
const TAG_SETS = [
  ['slab'],
  ['slab', 'balance'],
  ['dyno'],
  ['dyno', 'power'],
  ['crimpy'],
  ['crimpy', 'technical'],
  ['overhang'],
  ['power'],
  ['balance'],
  ['endurance'],
] as const;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function isoLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatClock(totalMinutes: number) {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${pad2(minutes)} ${period}`;
}

function sessionTimes(durationMinutes: number, seed: number) {
  const startMinutes = 16 * 60 + (seed % 5) * 15; // 4:00–5:00 PM-ish starts
  return {
    startTime: formatClock(startMinutes),
    endTime: formatClock(startMinutes + durationMinutes),
    durationMinutes,
  };
}

function pick<T>(items: readonly T[], seed: number) {
  return items[((seed % items.length) + items.length) % items.length];
}

function buildSessionClimbs(
  sessionIndex: number,
  location: DemoLocationRef,
  includeStandoutDyno: boolean,
  includeOrangeSend: boolean,
): SessionClimb[] {
  const climbCount = 2 + (sessionIndex % 4); // 2–5
  const climbs: SessionClimb[] = [];

  for (let i = 0; i < climbCount; i += 1) {
    const preferOrange = includeOrangeSend && i === 1;
    const level =
      preferOrange
        ? (location.levels.find((item) => item.name.toLowerCase() === 'orange') ??
          location.levels[1] ??
          location.levels[0])
        : location.levels[(sessionIndex + i * 2) % location.levels.length];
    const isWarmUp = i === 0;
    const isProject = i === climbCount - 1 && sessionIndex % 4 === 0;
    const tags = [...pick(TAG_SETS, sessionIndex * 3 + i)];
    if (includeStandoutDyno && i === 1 && !tags.includes('dyno')) tags.push('dyno');

    const flash =
      (includeOrangeSend && level.name.toLowerCase() === 'orange' && i === 1) ||
      (sessionIndex % 5 === 0 && i > 0 && !isProject);

    let attempts: SessionClimb['attempts'];
    if (flash) {
      attempts = [{ id: `many-${sessionIndex}-c${i}-a0`, progress: ['flash'] }];
    } else if (isProject) {
      attempts = [
        { id: `many-${sessionIndex}-c${i}-a0`, progress: ['start'] },
        { id: `many-${sessionIndex}-c${i}-a1`, progress: ['start', 'middle'] },
        { id: `many-${sessionIndex}-c${i}-a2`, progress: ['middle', 'end'] },
      ];
    } else {
      attempts = [{ id: `many-${sessionIndex}-c${i}-a0`, progress: ['send'] }];
    }

    climbs.push({
      id: `many-${sessionIndex}-c${i}`,
      levelId: level.id,
      levelName: level.name,
      levelColor: level.color,
      name: pick(CLIMB_NAMES, sessionIndex * 5 + i),
      tags,
      notes: isProject ? 'Still projecting' : '',
      hasImage: sessionIndex % 3 === 0 && i === 1,
      hasVideo: sessionIndex % 5 === 0 && i === 2,
      isWarmUp,
      isRepeat: sessionIndex % 6 === 0 && i === 1,
      isProject,
      attempts,
    });
  }

  return climbs;
}

/**
 * Dense history for trends / many-sessions demos: ~2–3 sessions per week over
 * ~3 months, varied durations, mostly home gym with occasional visits elsewhere.
 */
export function createFlowManySessions(
  home: DemoLocationRef,
  secondary?: DemoLocationRef,
  now = new Date(2026, 6, 18, 12, 0, 0, 0),
): ClimbingSession[] {
  const sessions: ClimbingSession[] = [];
  let sessionIndex = 0;

  for (let daysAgo = 0; daysAgo < 90; daysAgo += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    const dow = date.getDay();
    const week = Math.floor(daysAgo / 7);

    const isPrimary = dow === 1 || dow === 3 || dow === 5;
    const isTuesdayBonus = dow === 2 && week % 2 === 0;
    const isSaturdayBonus = dow === 6 && week % 3 === 0;
    if (!isPrimary && !isTuesdayBonus && !isSaturdayBonus) continue;
    // Occasional missed primary day so the grid is not perfectly regular.
    if (isPrimary && (daysAgo + dow) % 8 === 0) continue;

    const atSecondary = Boolean(secondary) && sessionIndex % 5 === 4;
    const location = atSecondary && secondary ? secondary : home;
    const duration = pick(SESSION_DURATIONS_MIN, sessionIndex * 7 + week);
    const times = sessionTimes(duration, sessionIndex);
    const climbs = buildSessionClimbs(
      sessionIndex,
      location,
      sessionIndex === 4,
      sessionIndex === 7,
    );

    sessions.push({
      id: `demo-many-${sessionIndex}`,
      status: 'completed',
      date: isoLocal(date),
      ...times,
      locationId: location.id,
      locationName: location.name,
      isPublic: sessionIndex % 4 === 0,
      ownerUsername: 'alex_climber',
      ownerAvatar: PET_ROCK_AVATARS[0],
      climbs,
    });
    sessionIndex += 1;
  }

  return sessions.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

/** Second gym with a different colour→level palette than the home gym. */
export function createFlowSecondaryLocationLevels(): DemoLevel[] {
  return DEFAULT_LEVEL_COLORS.slice(4, 9).map((preset, index) => ({
    id: `demo-alt-level-${index}`,
    name: preset.name,
    color: preset.color,
  }));
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
