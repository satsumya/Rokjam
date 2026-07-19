import { createContext, useContext, useMemo, useState } from 'react';

import { createDemoSessions, MOCK_PUBLIC_SESSIONS } from '../constants/mockSessions';
import {
  buildFlowDemoSession,
  createFlowManySessions,
  createFlowSecondaryLocationLevels,
  FLOW_DEMO_SESSION_ID,
  type FlowDemoPreset,
} from '../constants/flowDemoSessions';
import { DEFAULT_LEVEL_COLORS, PET_ROCK_AVATARS } from '../constants/difficultyLevels';
import { colors } from '../theme/colors';
import {
  IMPROVEMENT_TAG_SUGGESTIONS,
  MOCK_EXISTING_USER,
  STRENGTH_TAG_SUGGESTIONS,
} from '../constants/mockData';
import type { ClimbingSession, SessionClimb } from '../types/climbingSession';
import { nowTimeLabel, todayIso } from '../utils/sessionUtils';

export type DifficultyLevel = {
  id: string;
  name: string;
  color: string;
};

export type Location = {
  id: string;
  name: string;
  nickname?: string;
  isHome: boolean;
  levels: DifficultyLevel[];
  levelSort: 'easy-hard' | 'hard-easy';
};

type PrototypeContextValue = {
  email: string;
  setEmail: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  avatar: string;
  setAvatar: (value: string) => void;
  locations: Location[];
  strengthTags: string[];
  improvementTags: string[];
  profileComplete: boolean;
  profileSkipped: boolean;
  sessions: ClimbingSession[];
  publicSessions: ClimbingSession[];
  followedUsers: string[];
  setProfileComplete: (value: boolean) => void;
  setProfileSkipped: (value: boolean) => void;
  addStrengthTag: (tag: string) => void;
  removeStrengthTag: (tag: string) => void;
  addImprovementTag: (tag: string) => void;
  removeImprovementTag: (tag: string) => void;
  addLocation: (name: string, nickname?: string) => string;
  addLocationWithLevels: (
    name: string,
    nickname: string | undefined,
    levels: DifficultyLevel[],
  ) => string;
  updateLocation: (id: string, patch: Partial<Location>) => void;
  removeLocation: (id: string) => void;
  setHomeLocation: (id: string) => void;
  addLevel: (locationId: string) => void;
  removeLevel: (locationId: string, levelId: string) => void;
  moveLevel: (locationId: string, levelId: string, direction: 'up' | 'down') => void;
  swapLevels: (locationId: string, fromId: string, toId: string) => void;
  toggleLevelSort: (locationId: string) => void;
  updateLevel: (locationId: string, levelId: string, patch: Partial<DifficultyLevel>) => void;
  startSession: () => string;
  updateSession: (id: string, patch: Partial<ClimbingSession>) => void;
  completeSession: (id: string, patch?: Partial<ClimbingSession>) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => ClimbingSession | undefined;
  addClimb: (sessionId: string, climb: Omit<SessionClimb, 'id'>) => string;
  updateClimb: (sessionId: string, climbId: string, patch: Partial<SessionClimb>) => void;
  removeClimb: (sessionId: string, climbId: string) => void;
  seedDemoSessions: () => void;
  seedDemoActiveSession: () => void;
  seedFlowDemo: (preset: FlowDemoPreset) => void;
  seedDemoProfileOnly: () => void;
  seedReturningUser: () => void;
  toggleFollowUser: (username: string) => void;
  resetSession: () => void;
};

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

function createDefaultLevel(index: number): DifficultyLevel {
  const preset = DEFAULT_LEVEL_COLORS[index];
  if (preset) {
    return { id: `${Date.now()}-${index}`, name: preset.name, color: preset.color };
  }
  return { id: `${Date.now()}-${index}`, name: 'Custom', color: colors.neutral[400] };
}

function createDemoLocation(): Location {
  return {
    id: 'demo-location',
    name: 'Urban Climb West End, Montague Rd Brisbane',
    nickname: 'Home gym',
    isHome: true,
    levelSort: 'easy-hard',
    levels: DEFAULT_LEVEL_COLORS.slice(0, 5).map((preset, index) => ({
      id: `demo-level-${index}`,
      name: preset.name,
      color: preset.color,
    })),
  };
}

function createSecondaryDemoLocation(): Location {
  return {
    id: 'demo-location-kp',
    name: 'Kangaroo Point Cliffs, River Terrace Brisbane',
    nickname: 'KP cliffs',
    isHome: false,
    levelSort: 'easy-hard',
    levels: createFlowSecondaryLocationLevels(),
  };
}

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string>(PET_ROCK_AVATARS[0]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [strengthTags, setStrengthTags] = useState<string[]>([]);
  const [improvementTags, setImprovementTags] = useState<string[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileSkipped, setProfileSkipped] = useState(false);
  const [sessions, setSessions] = useState<ClimbingSession[]>([]);
  const [publicSessions] = useState<ClimbingSession[]>(MOCK_PUBLIC_SESSIONS);
  const [followedUsers, setFollowedUsers] = useState<string[]>(['alex_climber', 'crimp_queen']);

  const value = useMemo<PrototypeContextValue>(
    () => ({
      email,
      setEmail,
      username,
      setUsername,
      avatar,
      setAvatar,
      locations,
      strengthTags,
      improvementTags,
      profileComplete,
      profileSkipped,
      sessions,
      publicSessions,
      followedUsers,
      setProfileComplete,
      setProfileSkipped,
      addStrengthTag: (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        setStrengthTags((current) => (current.includes(trimmed) ? current : [...current, trimmed]));
      },
      removeStrengthTag: (tag) => setStrengthTags((current) => current.filter((item) => item !== tag)),
      addImprovementTag: (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        setImprovementTags((current) => (current.includes(trimmed) ? current : [...current, trimmed]));
      },
      removeImprovementTag: (tag) =>
        setImprovementTags((current) => current.filter((item) => item !== tag)),
      addLocation: (name, nickname) => {
        const id = `${Date.now()}`;
        setLocations((current) => [
          ...current,
          {
            id,
            name,
            nickname,
            isHome: current.length === 0,
            levels: [createDefaultLevel(0)],
            levelSort: 'easy-hard',
          },
        ]);
        return id;
      },
      addLocationWithLevels: (name, nickname, levels) => {
        const id = `${Date.now()}`;
        const normalized = levels.map((level, index) => ({
          id: level.id.startsWith('draft-') ? `${id}-level-${index}` : level.id,
          name: level.name.trim() || createDefaultLevel(index).name,
          color: level.color.trim() || createDefaultLevel(index).color,
        }));
        setLocations((current) => [
          ...current,
          {
            id,
            name,
            nickname,
            isHome: current.length === 0,
            levels: normalized.length ? normalized : [createDefaultLevel(0)],
            levelSort: 'easy-hard' as const,
          },
        ]);
        return id;
      },
      updateLocation: (id, patch) => {
        setLocations((current) => current.map((loc) => (loc.id === id ? { ...loc, ...patch } : loc)));
      },
      removeLocation: (id) => {
        setLocations((current) => {
          const next = current.filter((loc) => loc.id !== id);
          if (next.length > 0 && !next.some((loc) => loc.isHome)) {
            return next.map((loc, index) => (index === 0 ? { ...loc, isHome: true } : loc));
          }
          return next;
        });
      },
      setHomeLocation: (id) => {
        setLocations((current) => current.map((loc) => ({ ...loc, isHome: loc.id === id })));
      },
      addLevel: (locationId) => {
        setLocations((current) =>
          current.map((loc) => {
            if (loc.id !== locationId) return loc;
            return { ...loc, levels: [...loc.levels, createDefaultLevel(loc.levels.length)] };
          }),
        );
      },
      removeLevel: (locationId, levelId) => {
        setLocations((current) =>
          current.map((loc) => {
            if (loc.id !== locationId || loc.levels.length <= 1) return loc;
            return { ...loc, levels: loc.levels.filter((level) => level.id !== levelId) };
          }),
        );
      },
      moveLevel: (locationId, levelId, direction) => {
        setLocations((current) =>
          current.map((loc) => {
            if (loc.id !== locationId) return loc;
            const index = loc.levels.findIndex((level) => level.id === levelId);
            if (index < 0) return loc;
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= loc.levels.length) return loc;
            const levels = [...loc.levels];
            [levels[index], levels[targetIndex]] = [levels[targetIndex], levels[index]];
            return { ...loc, levels };
          }),
        );
      },
      swapLevels: (locationId, fromId, toId) => {
        setLocations((current) =>
          current.map((loc) => {
            if (loc.id !== locationId) return loc;
            const fromIndex = loc.levels.findIndex((level) => level.id === fromId);
            const toIndex = loc.levels.findIndex((level) => level.id === toId);
            if (fromIndex < 0 || toIndex < 0) return loc;
            const levels = [...loc.levels];
            [levels[fromIndex], levels[toIndex]] = [levels[toIndex], levels[fromIndex]];
            return { ...loc, levels };
          }),
        );
      },
      toggleLevelSort: (locationId) => {
        setLocations((current) =>
          current.map((loc) =>
            loc.id === locationId
              ? {
                  ...loc,
                  levelSort: loc.levelSort === 'easy-hard' ? 'hard-easy' : 'easy-hard',
                  levels: [...loc.levels].reverse(),
                }
              : loc,
          ),
        );
      },
      updateLevel: (locationId, levelId, patch) => {
        setLocations((current) =>
          current.map((loc) => {
            if (loc.id !== locationId) return loc;
            return {
              ...loc,
              levels: loc.levels.map((level) => {
                if (level.id !== levelId) return level;
                const next = { ...level, ...patch };
                if ('color' in patch && !patch.color?.trim()) {
                  next.color = level.color;
                }
                return next;
              }),
            };
          }),
        );
        // Keep denormalised climb grades in sync with profile level edits.
        if (patch.name !== undefined || patch.color !== undefined) {
          setSessions((current) =>
            current.map((session) => {
              if (session.locationId !== locationId) return session;
              let changed = false;
              const climbs = session.climbs.map((climb) => {
                if (climb.levelId !== levelId) return climb;
                changed = true;
                return {
                  ...climb,
                  ...(patch.name !== undefined ? { levelName: patch.name } : null),
                  ...(patch.color !== undefined && patch.color.trim()
                    ? { levelColor: patch.color }
                    : null),
                };
              });
              return changed ? { ...session, climbs } : session;
            }),
          );
        }
      },
      startSession: () => {
        const home = locations.find((l) => l.isHome) ?? locations[0];
        const id = `${Date.now()}`;
        const session: ClimbingSession = {
          id,
          status: 'active',
          date: todayIso(),
          startTime: nowTimeLabel(),
          locationId: home?.id ?? '',
          locationName: home?.name ?? '',
          climbs: [],
          isPublic: false,
          ownerUsername: username,
          ownerAvatar: avatar,
        };
        setSessions((current) => [session, ...current]);
        return id;
      },
      updateSession: (id, patch) => {
        setSessions((current) =>
          current.map((session) => (session.id === id ? { ...session, ...patch } : session)),
        );
      },
      completeSession: (id, patch) => {
        setSessions((current) =>
          current.map((session) =>
            session.id === id ? { ...session, ...patch, status: 'completed' as const } : session,
          ),
        );
      },
      deleteSession: (id) => {
        setSessions((current) => current.filter((session) => session.id !== id));
      },
      getSession: (id) => sessions.find((session) => session.id === id),
      addClimb: (sessionId, climb) => {
        const climbId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setSessions((current) =>
          current.map((session) =>
            session.id === sessionId
              ? { ...session, climbs: [...session.climbs, { ...climb, id: climbId }] }
              : session,
          ),
        );
        return climbId;
      },
      updateClimb: (sessionId, climbId, patch) => {
        setSessions((current) =>
          current.map((session) => {
            if (session.id !== sessionId) return session;
            return {
              ...session,
              climbs: session.climbs.map((climb) =>
                climb.id === climbId ? { ...climb, ...patch } : climb,
              ),
            };
          }),
        );
      },
      removeClimb: (sessionId, climbId) => {
        setSessions((current) =>
          current.map((session) => {
            if (session.id !== sessionId) return session;
            return { ...session, climbs: session.climbs.filter((c) => c.id !== climbId) };
          }),
        );
      },
      seedDemoSessions: () => {
        const demoLocation = locations[0] ?? createDemoLocation();
        if (locations.length === 0) {
          setLocations([demoLocation]);
          setProfileComplete(true);
        }
        if (!username) setUsername('member');
        setSessions(createDemoSessions(demoLocation.id, demoLocation.name));
      },
      seedDemoActiveSession: () => {
        const demoLocation = createDemoLocation();
        const levels = DEFAULT_LEVEL_COLORS.slice(0, 5);
        setLocations([demoLocation]);
        setUsername('alex_climber');
        setProfileComplete(true);
        setProfileSkipped(false);
        setSessions([
          {
            id: 'demo-active-session',
            status: 'active',
            date: todayIso(),
            startTime: nowTimeLabel(),
            locationId: demoLocation.id,
            locationName: demoLocation.name,
            isPublic: false,
            ownerUsername: 'alex_climber',
            ownerAvatar: PET_ROCK_AVATARS[0],
            climbs: [
              {
                id: 'ac1',
                levelId: 'demo-level-1',
                levelName: levels[1].name,
                levelColor: levels[1].color,
                name: 'Project wall',
                tags: ['crimpy'],
                notes: '',
                hasImage: false,
                hasVideo: false,
                isWarmUp: false,
                isRepeat: false,
                isProject: true,
                attempts: [{ id: 'aa1', progress: ['start'] }],
              },
            ],
          },
        ]);
      },
      seedFlowDemo: (preset) => {
        const demoLocation = createDemoLocation();

        if (preset === 'profile-incomplete') {
          // Post sign-up / skipped profile: account email only — no username, locations, or tags.
          setEmail('new.climber@example.com');
          setAvatar(PET_ROCK_AVATARS[0]);
          setUsername('');
          setStrengthTags([]);
          setImprovementTags([]);
          setLocations([]);
          setProfileComplete(false);
          setProfileSkipped(true);
          setSessions([]);
          return;
        }

        setEmail('returning.user@example.com');
        setAvatar(PET_ROCK_AVATARS[0]);
        setUsername('alex_climber');
        setStrengthTags(STRENGTH_TAG_SUGGESTIONS.slice(0, 2));
        setImprovementTags(IMPROVEMENT_TAG_SUGGESTIONS.slice(0, 1));

        if (preset === 'profile-ready') {
          setLocations([demoLocation]);
          setProfileComplete(true);
          setProfileSkipped(false);
          setSessions([]);
          return;
        }

        if (preset === 'dashboard-one-session') {
          setLocations([demoLocation]);
          setProfileComplete(true);
          setProfileSkipped(false);
          setSessions(createDemoSessions(demoLocation.id, demoLocation.name).slice(0, 1));
          return;
        }

        if (preset === 'dashboard-many-sessions') {
          const secondary = createSecondaryDemoLocation();
          setLocations([demoLocation, secondary]);
          setProfileComplete(true);
          setProfileSkipped(false);
          setSessions(
            createFlowManySessions(
              {
                id: demoLocation.id,
                name: demoLocation.name,
                levels: demoLocation.levels,
              },
              {
                id: secondary.id,
                name: secondary.name,
                levels: secondary.levels,
              },
            ),
          );
          return;
        }

        const incomplete = preset === 'active-empty-incomplete';
        if (incomplete) {
          setEmail('new.climber@example.com');
          setUsername('');
          setStrengthTags([]);
          setImprovementTags([]);
          setLocations([]);
          setProfileComplete(false);
          setProfileSkipped(true);
        } else {
          setLocations([demoLocation]);
          setProfileComplete(true);
          setProfileSkipped(false);
        }

        const session = buildFlowDemoSession(
          preset,
          incomplete ? '' : demoLocation.id,
          incomplete ? '' : demoLocation.name,
        );
        setSessions(session ? [session] : []);
      },
      seedDemoProfileOnly: () => {
        const demoLocation = createDemoLocation();
        setLocations([demoLocation]);
        setProfileComplete(true);
        setProfileSkipped(false);
        setSessions([]);
      },
      seedReturningUser: () => {
        const demoLocation = createDemoLocation();
        setEmail(MOCK_EXISTING_USER.email);
        setUsername(MOCK_EXISTING_USER.username);
        setAvatar(PET_ROCK_AVATARS[0]);
        setLocations([demoLocation]);
        setStrengthTags(STRENGTH_TAG_SUGGESTIONS.slice(0, 2));
        setImprovementTags(IMPROVEMENT_TAG_SUGGESTIONS.slice(0, 1));
        setProfileComplete(true);
        setProfileSkipped(false);
        setSessions(createDemoSessions(demoLocation.id, demoLocation.name));
      },
      toggleFollowUser: (user) => {
        setFollowedUsers((current) =>
          current.includes(user) ? current.filter((u) => u !== user) : [...current, user],
        );
      },
      resetSession: () => {
        setEmail('');
        setUsername('');
        setAvatar(PET_ROCK_AVATARS[0]);
        setLocations([]);
        setStrengthTags([]);
        setImprovementTags([]);
        setProfileComplete(false);
        setProfileSkipped(false);
        setSessions([]);
        setFollowedUsers(['alex_climber', 'crimp_queen']);
      },
    }),
    [
      avatar,
      email,
      followedUsers,
      improvementTags,
      locations,
      profileComplete,
      profileSkipped,
      publicSessions,
      sessions,
      strengthTags,
      username,
    ],
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error('usePrototype must be used within PrototypeProvider');
  }
  return context;
}
