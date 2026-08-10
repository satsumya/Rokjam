import { createDefaultLevel } from '../../mock/helpers';
import { getSupabaseClient } from './client';
import { newUuid } from './newUuid';
import {
  levelsToRows,
  mapProfileRows,
  type LoadedProfile,
  type LocationRow,
  type ProfileRow,
} from './profileMappers';
import type { DifficultyLevel, Location } from '../../../domain/types/profile';

export type { LoadedProfile };

export async function fetchUserProfile(userId: string): Promise<LoadedProfile | null> {
  const supabase = getSupabaseClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) return null;

  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select('*, difficulty_levels(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (locationsError) throw locationsError;

  return mapProfileRows(profile as ProfileRow, (locations ?? []) as LocationRow[]);
}

export async function checkUsernameTaken(username: string, excludeUserId?: string): Promise<boolean> {
  const normalized = username.trim();
  if (!normalized) return false;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc('is_username_taken', {
    check_username: normalized,
    exclude_id: excludeUserId ?? null,
  });

  if (error) throw error;
  return Boolean(data);
}

export async function updateProfileFields(
  userId: string,
  fields: Partial<{
    username: string;
    avatar: string;
    profileComplete: boolean;
    profileSkipped: boolean;
    strengthTags: string[];
    improvementTags: string[];
  }>,
): Promise<void> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (fields.username !== undefined) patch.username = fields.username.trim() || null;
  if (fields.avatar !== undefined) patch.avatar = fields.avatar;
  if (fields.profileComplete !== undefined) patch.profile_complete = fields.profileComplete;
  if (fields.profileSkipped !== undefined) patch.profile_skipped = fields.profileSkipped;
  if (fields.strengthTags !== undefined) patch.strength_tags = fields.strengthTags;
  if (fields.improvementTags !== undefined) patch.improvement_tags = fields.improvementTags;

  const { error } = await getSupabaseClient().from('profiles').update(patch).eq('id', userId);
  if (error) throw error;
}

export async function insertLocation(userId: string, location: Location): Promise<void> {
  const supabase = getSupabaseClient();
  const { error: locationError } = await supabase.from('locations').insert({
    id: location.id,
    user_id: userId,
    name: location.name,
    nickname: location.nickname ?? null,
    is_home: location.isHome,
    level_sort: location.levelSort,
  });
  if (locationError) throw locationError;

  const levelRows = levelsToRows(location.id, location.levels);
  if (levelRows.length === 0) return;

  const { error: levelsError } = await supabase.from('difficulty_levels').insert(levelRows);
  if (levelsError) throw levelsError;
}

export async function updateLocationRecord(
  userId: string,
  locationId: string,
  patch: Partial<Location>,
): Promise<void> {
  const supabase = getSupabaseClient();
  const locationPatch: Record<string, unknown> = {};

  if (patch.name !== undefined) locationPatch.name = patch.name;
  if (patch.nickname !== undefined) locationPatch.nickname = patch.nickname ?? null;
  if (patch.isHome !== undefined) locationPatch.is_home = patch.isHome;
  if (patch.levelSort !== undefined) locationPatch.level_sort = patch.levelSort;

  if (Object.keys(locationPatch).length > 0) {
    const { error } = await supabase
      .from('locations')
      .update(locationPatch)
      .eq('id', locationId)
      .eq('user_id', userId);
    if (error) throw error;
  }

  if (patch.levels !== undefined) {
    await replaceLocationLevels(locationId, patch.levels);
  }
}

async function replaceLocationLevels(locationId: string, levels: DifficultyLevel[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { error: deleteError } = await supabase
    .from('difficulty_levels')
    .delete()
    .eq('location_id', locationId);
  if (deleteError) throw deleteError;

  const levelRows = levelsToRows(locationId, levels);
  if (levelRows.length === 0) return;

  const { error: insertError } = await supabase.from('difficulty_levels').insert(levelRows);
  if (insertError) throw insertError;
}

export async function deleteLocationRecord(userId: string, locationId: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('locations')
    .delete()
    .eq('id', locationId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function setHomeLocationRecord(userId: string, locationId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error: clearError } = await supabase
    .from('locations')
    .update({ is_home: false })
    .eq('user_id', userId);
  if (clearError) throw clearError;

  const { error: setError } = await supabase
    .from('locations')
    .update({ is_home: true })
    .eq('id', locationId)
    .eq('user_id', userId);
  if (setError) throw setError;
}

export async function insertLevel(locationId: string, level: DifficultyLevel, sortOrder: number): Promise<void> {
  const { error } = await getSupabaseClient().from('difficulty_levels').insert({
    id: level.id,
    location_id: locationId,
    name: level.name,
    color: level.color,
    sort_order: sortOrder,
  });
  if (error) throw error;
}

export async function deleteLevelRecord(locationId: string, levelId: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('difficulty_levels')
    .delete()
    .eq('id', levelId)
    .eq('location_id', locationId);
  if (error) throw error;
}

export async function updateLevelRecord(
  locationId: string,
  levelId: string,
  patch: Partial<DifficultyLevel>,
  sortOrder?: number,
): Promise<void> {
  const levelPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) levelPatch.name = patch.name;
  if (patch.color !== undefined) levelPatch.color = patch.color;
  if (sortOrder !== undefined) levelPatch.sort_order = sortOrder;

  if (Object.keys(levelPatch).length === 0) return;

  const { error } = await getSupabaseClient()
    .from('difficulty_levels')
    .update(levelPatch)
    .eq('id', levelId)
    .eq('location_id', locationId);
  if (error) throw error;
}

export async function syncLevelOrder(locationId: string, levels: DifficultyLevel[]): Promise<void> {
  await replaceLocationLevels(locationId, levels);
}

export function buildLocationWithDefaultLevel(
  name: string,
  nickname: string | undefined,
  isHome: boolean,
  id = newUuid(),
): Location {
  const defaultLevel = createDefaultLevel(0);
  return {
    id,
    name,
    nickname,
    isHome,
    levels: [{ ...defaultLevel, id: newUuid() }],
    levelSort: 'easy-hard',
  };
}

export function buildLocationWithLevels(
  name: string,
  nickname: string | undefined,
  levels: DifficultyLevel[],
  isHome: boolean,
  id = newUuid(),
): Location {
  const normalized = levels.map((level, index) => ({
    id: level.id.startsWith('draft-') ? newUuid() : level.id,
    name: level.name.trim() || createDefaultLevel(index).name,
    color: level.color.trim() || createDefaultLevel(index).color,
  }));

  return {
    id,
    name,
    nickname,
    isHome,
    levels: normalized.length ? normalized : [{ ...createDefaultLevel(0), id: newUuid() }],
    levelSort: 'easy-hard',
  };
}
