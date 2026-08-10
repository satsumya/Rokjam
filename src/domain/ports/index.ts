import type { FlowDemoPreset } from '../../constants/flowDemoSessions';
import type { ClimbingSession, SessionClimb } from '../../types/climbingSession';
import type { DifficultyLevel, Location } from '../types/profile';

export type AuthRepository = {
  email: string;
  setEmail: (value: string) => void;
};

export type ProfileRepository = {
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
};

export type SessionRepository = {
  sessions: ClimbingSession[];
  startSession: () => string;
  updateSession: (id: string, patch: Partial<ClimbingSession>) => void;
  completeSession: (id: string, patch?: Partial<ClimbingSession>) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => ClimbingSession | undefined;
  addClimb: (sessionId: string, climb: Omit<SessionClimb, 'id'>) => string;
  updateClimb: (sessionId: string, climbId: string, patch: Partial<SessionClimb>) => void;
  removeClimb: (sessionId: string, climbId: string) => void;
};

export type CommunityRepository = {
  publicSessions: ClimbingSession[];
  followedUsers: string[];
  toggleFollowUser: (username: string) => void;
};

export type MockSeedingRepository = {
  seedDemoSessions: () => void;
  seedDemoActiveSession: () => void;
  seedFlowDemo: (preset: FlowDemoPreset) => void;
  seedDemoProfileOnly: () => void;
  seedReturningUser: () => void;
  resetSession: () => void;
};

export type AppDataRepositories = AuthRepository &
  ProfileRepository &
  SessionRepository &
  CommunityRepository &
  MockSeedingRepository;
