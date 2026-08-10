import { PET_ROCK_AVATARS } from '../../../constants/difficultyLevels';
import type { DifficultyLevel, Location } from '../../../domain/types/profile';

export type ProfileRow = {
  id: string;
  username: string | null;
  avatar: string | null;
  profile_complete: boolean;
  profile_skipped: boolean;
  strength_tags: string[];
  improvement_tags: string[];
};

export type LevelRow = {
  id: string;
  location_id: string;
  name: string;
  color: string;
  sort_order: number;
};

export type LocationRow = {
  id: string;
  user_id: string;
  name: string;
  nickname: string | null;
  is_home: boolean;
  level_sort: 'easy-hard' | 'hard-easy';
  difficulty_levels?: LevelRow[] | null;
};

export type LoadedProfile = {
  username: string;
  avatar: string;
  locations: Location[];
  strengthTags: string[];
  improvementTags: string[];
  profileComplete: boolean;
  profileSkipped: boolean;
};

function mapLevelRow(row: LevelRow): DifficultyLevel {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
  };
}

export function mapLocationRow(row: LocationRow): Location {
  const levels = [...(row.difficulty_levels ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapLevelRow);

  return {
    id: row.id,
    name: row.name,
    nickname: row.nickname ?? undefined,
    isHome: row.is_home,
    levels,
    levelSort: row.level_sort,
  };
}

export function mapProfileRows(profile: ProfileRow, locations: LocationRow[]): LoadedProfile {
  return {
    username: profile.username ?? '',
    avatar: profile.avatar ?? PET_ROCK_AVATARS[0],
    locations: locations.map(mapLocationRow),
    strengthTags: profile.strength_tags ?? [],
    improvementTags: profile.improvement_tags ?? [],
    profileComplete: profile.profile_complete,
    profileSkipped: profile.profile_skipped,
  };
}

export function levelsToRows(locationId: string, levels: DifficultyLevel[]): LevelRow[] {
  return levels.map((level, index) => ({
    id: level.id,
    location_id: locationId,
    name: level.name,
    color: level.color,
    sort_order: index,
  }));
}
