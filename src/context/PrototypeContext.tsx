import { createContext, useContext, useMemo, useState } from 'react';

import { MOCK_COMMUNITY_POSTS, type CommunityPost } from '../constants/mockCommunity';
import { DEFAULT_LEVEL_COLORS, PET_ROCK_AVATARS } from '../constants/difficultyLevels';
import type { ClimbingLog } from '../types/climbingLog';

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
  climbingLogs: ClimbingLog[];
  communityPosts: CommunityPost[];
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
  addClimbingLog: (log: Omit<ClimbingLog, 'id'>) => string;
  updateClimbingLog: (id: string, patch: Partial<ClimbingLog>) => void;
  deleteClimbingLog: (id: string) => void;
  getClimbingLog: (id: string) => ClimbingLog | undefined;
  seedDemoLogs: () => void;
  toggleFollowPost: (postId: string) => void;
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

function createDemoLocation() {
  return {
    id: 'demo-location',
    name: 'Urban Climb West End, Montague Rd Brisbane',
    nickname: 'Home gym',
    isHome: true,
    levelSort: 'easy-hard' as const,
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
  const [climbingLogs, setClimbingLogs] = useState<ClimbingLog[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);

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
      climbingLogs,
      communityPosts,
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
        setLocations((current) =>
          current.map((loc) => ({ ...loc, isHome: loc.id === id })),
        );
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
      addClimbingLog: (log) => {
        const id = `${Date.now()}`;
        setClimbingLogs((current) => [{ ...log, id }, ...current]);
        return id;
      },
      updateClimbingLog: (id, patch) => {
        setClimbingLogs((current) =>
          current.map((log) => (log.id === id ? { ...log, ...patch } : log)),
        );
      },
      deleteClimbingLog: (id) => {
        setClimbingLogs((current) => current.filter((log) => log.id !== id));
      },
      getClimbingLog: (id) => climbingLogs.find((log) => log.id === id),
      seedDemoLogs: () => {
        const demoLocation = locations[0] ?? createDemoLocation();
        if (locations.length === 0) {
          setLocations([demoLocation]);
          setProfileComplete(true);
        }
        const level = demoLocation.levels[2] ?? demoLocation.levels[0];
        setClimbingLogs([
          {
            id: 'demo-log-1',
            locationId: demoLocation.id,
            locationName: demoLocation.name,
            levelId: level.id,
            levelName: level.name,
            levelColor: level.color,
            date: '2026-06-18',
            style: 'boulder',
            routeName: 'Slab warmup',
            outcome: 'send',
            notes: 'Felt solid on footwork.',
          },
          {
            id: 'demo-log-2',
            locationId: demoLocation.id,
            locationName: demoLocation.name,
            levelId: demoLocation.levels[1]?.id ?? level.id,
            levelName: demoLocation.levels[1]?.name ?? level.name,
            levelColor: demoLocation.levels[1]?.color ?? level.color,
            date: '2026-06-15',
            style: 'top-rope',
            routeName: 'Overhang project',
            outcome: 'working',
            attempts: 4,
            notes: 'Need better hip tension.',
          },
          {
            id: 'demo-log-3',
            locationId: demoLocation.id,
            locationName: demoLocation.name,
            levelId: demoLocation.levels[3]?.id ?? level.id,
            levelName: demoLocation.levels[3]?.name ?? level.name,
            levelColor: demoLocation.levels[3]?.color ?? level.color,
            date: '2026-06-10',
            style: 'lead',
            outcome: 'flash',
          },
        ]);
      },
      toggleFollowPost: (postId) => {
        setCommunityPosts((current) =>
          current.map((post) =>
            post.id === postId ? { ...post, isFollowing: !post.isFollowing } : post,
          ),
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
        setClimbingLogs([]);
        setCommunityPosts(MOCK_COMMUNITY_POSTS);
      },
    }),
    [
      avatar,
      climbingLogs,
      communityPosts,
      email,
      improvementTags,
      locations,
      profileComplete,
      profileSkipped,
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
