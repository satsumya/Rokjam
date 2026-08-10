import { DEFAULT_LEVEL_COLORS } from '../../constants/difficultyLevels';
import { createFlowSecondaryLocationLevels } from '../../constants/flowDemoSessions';
import { colors } from '../../theme/colors';
import type { DifficultyLevel, Location } from '../../domain/types/profile';

export function createDefaultLevel(index: number): DifficultyLevel {
  const preset = DEFAULT_LEVEL_COLORS[index];
  if (preset) {
    return { id: `${Date.now()}-${index}`, name: preset.name, color: preset.color };
  }
  return { id: `${Date.now()}-${index}`, name: 'Custom', color: colors.neutral[400] };
}

export function createDemoLocation(): Location {
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

export function createSecondaryDemoLocation(): Location {
  return {
    id: 'demo-location-kp',
    name: 'Kangaroo Point Cliffs, River Terrace Brisbane',
    nickname: 'KP cliffs',
    isHome: false,
    levelSort: 'easy-hard',
    levels: createFlowSecondaryLocationLevels(),
  };
}
