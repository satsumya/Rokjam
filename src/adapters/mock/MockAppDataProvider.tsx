import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  buildLocationWithDefaultLevel,
  buildLocationWithLevels,
  deleteLevelRecord,
  deleteLocationRecord,
  insertLevel,
  insertLocation,
  setHomeLocationRecord,
  syncLevelOrder,
  updateLevelRecord,
  updateLocationRecord,
  updateProfileFields,
} from '../api/supabase/profileActions';
import { createSupabaseAuthActions } from '../api/supabase/authActions';
import { tryGetSupabaseClient } from '../api/supabase/client';
import { newUuid } from '../api/supabase/newUuid';
import { logProfilePersistError, useSupabaseProfileLoad } from '../api/supabase/useSupabaseProfileSync';
import {
  deleteClimbRecord,
  deleteSessionRecord,
  insertClimb,
  insertSession,
  updateClimbRecord,
  updateSessionRecord,
} from '../api/supabase/sessionActions';
import {
  followUser,
  unfollowUser,
} from '../api/supabase/communityActions';
import { logSessionPersistError, useSupabaseSessionLoad } from '../api/supabase/useSupabaseSessionSync';
import { logCommunityPersistError, useSupabaseCommunityLoad } from '../api/supabase/useSupabaseCommunitySync';
import { createDemoSessions, MOCK_PUBLIC_SESSIONS } from '../../constants/mockSessions';
import {
  buildFlowDemoSession,
  createFlowManySessions,
  type FlowDemoPreset,
} from '../../constants/flowDemoSessions';
import { DEFAULT_LEVEL_COLORS, PET_ROCK_AVATARS } from '../../constants/difficultyLevels';
import {
  IMPROVEMENT_TAG_SUGGESTIONS,
  MOCK_EXISTING_USER,
  STRENGTH_TAG_SUGGESTIONS,
} from '../../constants/mockData';
import type { AppDataRepositories } from '../../domain/ports';
import type { ClimbingSession, SessionClimb } from '../../types/climbingSession';
import { nowTimeLabel, todayIso } from '../../utils/sessionUtils';
import { createMockAuthActions } from './authActions';
import {
  createDefaultLevel,
  createDemoLocation,
  createSecondaryDemoLocation,
} from './helpers';

const AppDataContext = createContext<AppDataRepositories | null>(null);

export type AuthBackend = 'mock' | 'supabase';

export function MockAppDataProvider({
  children,
  authBackend = 'mock',
}: {
  children: React.ReactNode;
  authBackend?: AuthBackend;
}) {
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsernameState] = useState('');
  const [avatar, setAvatar] = useState<string>(PET_ROCK_AVATARS[0]);
  const [locations, setLocations] = useState<AppDataRepositories['locations']>([]);
  const [strengthTags, setStrengthTags] = useState<string[]>([]);
  const [improvementTags, setImprovementTags] = useState<string[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileSkipped, setProfileSkipped] = useState(false);
  const [sessions, setSessions] = useState<ClimbingSession[]>([]);
  const [publicSessions, setPublicSessions] = useState<ClimbingSession[]>(MOCK_PUBLIC_SESSIONS);
  const [followedUsers, setFollowedUsers] = useState<string[]>(['alex_climber', 'crimp_queen']);

  const authActions = useMemo(
    () =>
      authBackend === 'supabase'
        ? createSupabaseAuthActions()
        : createMockAuthActions({
            setEmail,
            onSignOut: () => {
              setIsAuthenticated(false);
              setUserId(null);
            },
          }),
    [authBackend],
  );

  const profileBackend = authBackend === 'supabase';
  const sessionBackend = authBackend === 'supabase';
  const communityBackend = authBackend === 'supabase';

  const persistProfile = useCallback(
    (scope: string, action: () => Promise<void>) => {
      if (!profileBackend || !userId) return;
      void action().catch((error) => logProfilePersistError(scope, error));
    },
    [profileBackend, userId],
  );

  const persistSession = useCallback(
    (scope: string, action: () => Promise<void>) => {
      if (!sessionBackend || !userId) return;
      void action().catch((error) => logSessionPersistError(scope, error));
    },
    [sessionBackend, userId],
  );

  const persistCommunity = useCallback(
    (scope: string, action: () => Promise<void>) => {
      if (!communityBackend || !userId) return;
      void action().catch((error) => logCommunityPersistError(scope, error));
    },
    [communityBackend, userId],
  );

  useSupabaseProfileLoad(profileBackend, userId, {
    setUsername: setUsernameState,
    setAvatar,
    setLocations,
    setStrengthTags,
    setImprovementTags,
    setProfileComplete,
    setProfileSkipped,
  });

  useSupabaseSessionLoad(sessionBackend, userId, username, avatar, setSessions);

  useSupabaseCommunityLoad(communityBackend, userId, setPublicSessions, setFollowedUsers);

  useEffect(() => {
    if (authBackend !== 'supabase') return;
    const supabase = tryGetSupabaseClient();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? '');
      setIsAuthenticated(Boolean(session));
      setUserId(session?.user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? '');
      setIsAuthenticated(Boolean(session));
      setUserId(session?.user?.id ?? null);
      if (!session) {
        setUsernameState('');
        setAvatar(PET_ROCK_AVATARS[0]);
        setLocations([]);
        setStrengthTags([]);
        setImprovementTags([]);
        setProfileComplete(false);
        setProfileSkipped(false);
        setSessions([]);
        setPublicSessions([]);
        setFollowedUsers([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [authBackend]);

  const value = useMemo<AppDataRepositories>(
    () => ({
      email,
      setEmail,
      isAuthenticated,
      signInWithPassword: authActions.signInWithPassword,
      signUpWithPassword: authActions.signUpWithPassword,
      signOut: authActions.signOut,
      resetPasswordForEmail: authActions.resetPasswordForEmail,
      username,
      setUsername: (value) => {
        setUsernameState(value);
        persistProfile('setUsername', () => updateProfileFields(userId!, { username: value }));
      },
      avatar,
      setAvatar: (value) => {
        setAvatar(value);
        persistProfile('setAvatar', () => updateProfileFields(userId!, { avatar: value }));
      },
      locations,
      strengthTags,
      improvementTags,
      profileComplete,
      profileSkipped,
      sessions,
      publicSessions,
      followedUsers,
      setProfileComplete: (value) => {
        setProfileComplete(value);
        persistProfile('setProfileComplete', () =>
          updateProfileFields(userId!, { profileComplete: value }),
        );
      },
      setProfileSkipped: (value) => {
        setProfileSkipped(value);
        persistProfile('setProfileSkipped', () =>
          updateProfileFields(userId!, { profileSkipped: value }),
        );
      },
      addStrengthTag: (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        setStrengthTags((current) => {
          const next = current.includes(trimmed) ? current : [...current, trimmed];
          persistProfile('addStrengthTag', () => updateProfileFields(userId!, { strengthTags: next }));
          return next;
        });
      },
      removeStrengthTag: (tag) =>
        setStrengthTags((current) => {
          const next = current.filter((item) => item !== tag);
          persistProfile('removeStrengthTag', () => updateProfileFields(userId!, { strengthTags: next }));
          return next;
        }),
      addImprovementTag: (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        setImprovementTags((current) => {
          const next = current.includes(trimmed) ? current : [...current, trimmed];
          persistProfile('addImprovementTag', () =>
            updateProfileFields(userId!, { improvementTags: next }),
          );
          return next;
        });
      },
      removeImprovementTag: (tag) =>
        setImprovementTags((current) => {
          const next = current.filter((item) => item !== tag);
          persistProfile('removeImprovementTag', () =>
            updateProfileFields(userId!, { improvementTags: next }),
          );
          return next;
        }),
      addLocation: (name, nickname) => {
        let locationId = '';
        setLocations((current) => {
          const location = profileBackend
            ? buildLocationWithDefaultLevel(name, nickname, current.length === 0)
            : {
                id: `${Date.now()}`,
                name,
                nickname,
                isHome: current.length === 0,
                levels: [{ ...createDefaultLevel(0), id: `${Date.now()}-0` }],
                levelSort: 'easy-hard' as const,
              };
          locationId = location.id;
          persistProfile('addLocation', () => insertLocation(userId!, location));
          return [...current, location];
        });
        setProfileComplete(true);
        setProfileSkipped(false);
        persistProfile('addLocationFlags', () =>
          updateProfileFields(userId!, { profileComplete: true, profileSkipped: false }),
        );
        return locationId;
      },
      addLocationWithLevels: (name, nickname, levels) => {
        let locationId = '';
        setLocations((current) => {
          const location = profileBackend
            ? buildLocationWithLevels(name, nickname, levels, current.length === 0)
            : (() => {
                const id = `${Date.now()}`;
                const normalized = levels.map((level, index) => ({
                  id: level.id.startsWith('draft-') ? `${id}-level-${index}` : level.id,
                  name: level.name.trim() || createDefaultLevel(index).name,
                  color: level.color.trim() || createDefaultLevel(index).color,
                }));
                return {
                  id,
                  name,
                  nickname,
                  isHome: current.length === 0,
                  levels: normalized.length ? normalized : [createDefaultLevel(0)],
                  levelSort: 'easy-hard' as const,
                };
              })();
          locationId = location.id;
          persistProfile('addLocationWithLevels', () => insertLocation(userId!, location));
          return [...current, location];
        });
        setProfileComplete(true);
        setProfileSkipped(false);
        persistProfile('addLocationWithLevelsFlags', () =>
          updateProfileFields(userId!, { profileComplete: true, profileSkipped: false }),
        );
        return locationId;
      },
      updateLocation: (id, patch) => {
        setLocations((current) => {
          const next = current.map((loc) => (loc.id === id ? { ...loc, ...patch } : loc));
          persistProfile('updateLocation', () => updateLocationRecord(userId!, id, patch));
          return next;
        });
      },
      removeLocation: (id) => {
        setLocations((current) => {
          const next = current.filter((loc) => loc.id !== id);
          const normalized =
            next.length > 0 && !next.some((loc) => loc.isHome)
              ? next.map((loc, index) => (index === 0 ? { ...loc, isHome: true } : loc))
              : next;
          persistProfile('removeLocation', async () => {
            await deleteLocationRecord(userId!, id);
            const newHome = normalized.find((loc) => loc.isHome);
            if (newHome) await setHomeLocationRecord(userId!, newHome.id);
          });
          return normalized;
        });
      },
      setHomeLocation: (id) => {
        setLocations((current) => current.map((loc) => ({ ...loc, isHome: loc.id === id })));
        persistProfile('setHomeLocation', () => setHomeLocationRecord(userId!, id));
      },
      addLevel: (locationId) => {
        setLocations((current) =>
          current.map((loc) => {
            if (loc.id !== locationId) return loc;
            const level = profileBackend
              ? { ...createDefaultLevel(loc.levels.length), id: newUuid() }
              : createDefaultLevel(loc.levels.length);
            const levels = [...loc.levels, level];
            persistProfile('addLevel', () => insertLevel(locationId, level, levels.length - 1));
            return { ...loc, levels };
          }),
        );
      },
      removeLevel: (locationId, levelId) => {
        setLocations((current) =>
          current.map((loc) => {
            if (loc.id !== locationId || loc.levels.length <= 1) return loc;
            persistProfile('removeLevel', () => deleteLevelRecord(locationId, levelId));
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
            persistProfile('moveLevel', () => syncLevelOrder(locationId, levels));
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
            persistProfile('swapLevels', () => syncLevelOrder(locationId, levels));
            return { ...loc, levels };
          }),
        );
      },
      toggleLevelSort: (locationId) => {
        setLocations((current) => {
          const next = current.map((loc) =>
            loc.id === locationId
              ? {
                  ...loc,
                  levelSort: loc.levelSort === 'easy-hard' ? ('hard-easy' as const) : ('easy-hard' as const),
                  levels: [...loc.levels].reverse(),
                }
              : loc,
          );
          const location = next.find((loc) => loc.id === locationId);
          if (location) {
            persistProfile('toggleLevelSort', () =>
              updateLocationRecord(userId!, locationId, {
                levelSort: location.levelSort,
                levels: location.levels,
              }),
            );
          }
          return next;
        });
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
        persistProfile('updateLevel', () => updateLevelRecord(locationId, levelId, patch));
      },
      startSession: () => {
        const home = locations.find((l) => l.isHome) ?? locations[0];
        const id = sessionBackend ? newUuid() : `${Date.now()}`;
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
        persistSession('startSession', () => insertSession(userId!, session));
        return id;
      },
      updateSession: (id, patch) => {
        setSessions((current) =>
          current.map((session) => {
            if (session.id !== id) return session;
            const next = { ...session, ...patch };
            persistSession('updateSession', () =>
              updateSessionRecord(userId!, id, {
                ...patch,
                ownerUsername: next.ownerUsername || username,
                ownerAvatar: next.ownerAvatar || avatar,
              }),
            );
            return next;
          }),
        );
      },
      completeSession: (id, patch) => {
        setSessions((current) =>
          current.map((session) => {
            if (session.id !== id) return session;
            const next = { ...session, ...patch, status: 'completed' as const };
            persistSession('completeSession', () =>
              updateSessionRecord(userId!, id, {
                ...patch,
                status: 'completed',
                ownerUsername: next.ownerUsername || username,
                ownerAvatar: next.ownerAvatar || avatar,
              }),
            );
            return next;
          }),
        );
      },
      deleteSession: (id) => {
        setSessions((current) => current.filter((session) => session.id !== id));
        persistSession('deleteSession', () => deleteSessionRecord(userId!, id));
      },
      getSession: (id) => sessions.find((session) => session.id === id),
      addClimb: (sessionId, climb) => {
        const climbId = sessionBackend
          ? newUuid()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setSessions((current) =>
          current.map((session) => {
            if (session.id !== sessionId) return session;
            const nextClimb = { ...climb, id: climbId };
            persistSession('addClimb', () =>
              insertClimb(sessionId, nextClimb, session.climbs.length),
            );
            return { ...session, climbs: [...session.climbs, nextClimb] };
          }),
        );
        return climbId;
      },
      updateClimb: (sessionId, climbId, patch) => {
        setSessions((current) =>
          current.map((session) => {
            if (session.id !== sessionId) return session;
            const climbs = session.climbs.map((climb, index) => {
              if (climb.id !== climbId) return climb;
              const merged = { ...climb, ...patch };
              persistSession('updateClimb', () => updateClimbRecord(sessionId, climbId, merged, index));
              return merged;
            });
            return { ...session, climbs };
          }),
        );
      },
      removeClimb: (sessionId, climbId) => {
        setSessions((current) =>
          current.map((session) => {
            if (session.id !== sessionId) return session;
            persistSession('removeClimb', () => deleteClimbRecord(sessionId, climbId));
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
        if (!username) setUsernameState('member');
        setSessions(createDemoSessions(demoLocation.id, demoLocation.name));
      },
      seedDemoActiveSession: () => {
        const demoLocation = createDemoLocation();
        const levels = DEFAULT_LEVEL_COLORS.slice(0, 5);
        setLocations([demoLocation]);
        setUsernameState('alex_climber');
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
          setEmail('new.climber@example.com');
          setAvatar(PET_ROCK_AVATARS[0]);
          setUsernameState('');
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
        setUsernameState('alex_climber');
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
          setUsernameState('');
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
        setUsernameState(MOCK_EXISTING_USER.username);
        setAvatar(PET_ROCK_AVATARS[0]);
        setLocations([demoLocation]);
        setStrengthTags(STRENGTH_TAG_SUGGESTIONS.slice(0, 2));
        setImprovementTags(IMPROVEMENT_TAG_SUGGESTIONS.slice(0, 1));
        setProfileComplete(true);
        setProfileSkipped(false);
        setSessions(createDemoSessions(demoLocation.id, demoLocation.name));
      },
      toggleFollowUser: (user) => {
        setFollowedUsers((current) => {
          const isFollowing = current.includes(user);
          const next = isFollowing ? current.filter((u) => u !== user) : [...current, user];
          persistCommunity(isFollowing ? 'unfollowUser' : 'followUser', () =>
            isFollowing ? unfollowUser(userId!, user) : followUser(userId!, user),
          );
          return next;
        });
      },
      resetSession: () => {
        void authActions.signOut();
        setEmail('');
        setIsAuthenticated(false);
        setUserId(null);
        setUsernameState('');
        setAvatar(PET_ROCK_AVATARS[0]);
        setLocations([]);
        setStrengthTags([]);
        setImprovementTags([]);
        setProfileComplete(false);
        setProfileSkipped(false);
        setSessions([]);
        setPublicSessions(MOCK_PUBLIC_SESSIONS);
        setFollowedUsers(['alex_climber', 'crimp_queen']);
      },
    }),
    [
      authActions,
      avatar,
      email,
      followedUsers,
      improvementTags,
      isAuthenticated,
      locations,
      persistProfile,
      persistSession,
      persistCommunity,
      profileBackend,
      profileComplete,
      profileSkipped,
      publicSessions,
      sessionBackend,
      communityBackend,
      sessions,
      strengthTags,
      userId,
      username,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataRepositories {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
