import { createContext, useContext, useMemo, useState } from 'react';

import { createDemoSessions, MOCK_PUBLIC_SESSIONS } from '../constants/mockSessions';
import { DEFAULT_LEVEL_COLORS, PET_ROCK_AVATARS } from '../constants/difficultyLevels';
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
  updateLocation: (id: string, patch: Partial<Location>) => void;
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
  seedDemoProfileOnly: () => void;
  toggleFollowUser: (username: string) => void;
  resetSession: () => void;
};

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

function createDefaultLevel(index: number): DifficultyLevel {
  const preset = DEFAULT_LEVEL_COLORS[index];
  if (preset) {
    return { id: `${Date.now()}-${index}`, name: preset.name, color: preset.color };
  }
  return { id: `${Date.now()}-${index}`, name: 'Custom', color: '#AAAAAA' };
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
      updateLocation: (id, patch) => {
        setLocations((current) => current.map((loc) => (loc.id === id ? { ...loc, ...patch } : loc)));
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
      seedDemoProfileOnly: () => {
        const demoLocation = createDemoLocation();
        setLocations([demoLocation]);
        setProfileComplete(true);
        setProfileSkipped(false);
        if (!username) setUsername('member');
        setSessions([]);
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
