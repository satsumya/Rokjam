import { createContext, useContext, useMemo, useState } from 'react';

import { DEFAULT_LEVEL_COLORS, PET_ROCK_AVATARS } from '../constants/difficultyLevels';

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

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string>(PET_ROCK_AVATARS[0]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [strengthTags, setStrengthTags] = useState<string[]>([]);
  const [improvementTags, setImprovementTags] = useState<string[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileSkipped, setProfileSkipped] = useState(false);

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
      resetSession: () => {
        setEmail('');
        setUsername('');
        setAvatar(PET_ROCK_AVATARS[0]);
        setLocations([]);
        setStrengthTags([]);
        setImprovementTags([]);
        setProfileComplete(false);
        setProfileSkipped(false);
      },
    }),
    [
      avatar,
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
