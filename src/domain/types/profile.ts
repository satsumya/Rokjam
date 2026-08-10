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

/** Saves a new location with graded levels; returns the new location id. */
export type AddLocationWithLevelsHandler = (
  name: string,
  nickname: string | undefined,
  levels: DifficultyLevel[],
) => string;
