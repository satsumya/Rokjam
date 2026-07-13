import type { Decorator } from '@storybook/react-native';
import { ScrollView } from 'react-native';

import { PrototypeProvider } from '../context/PrototypeContext';
import type { Location } from '../context/PrototypeContext';
import { DEFAULT_LEVEL_COLORS } from '../constants/difficultyLevels';
import type { SessionClimb } from '../types/climbingSession';
import { ui } from '../theme/colors';

/** Pads stories and gives them the app background so components sit on-brand. */
export const Padded: Decorator = (Story) => (
  <ScrollView
    style={{ flex: 1, backgroundColor: ui.background }}
    contentContainerStyle={{ padding: 16, gap: 12 }}
    keyboardShouldPersistTaps="handled"
  >
    <Story />
  </ScrollView>
);

/** Wraps stories whose components read from the prototype context. */
export const WithPrototype: Decorator = (Story) => (
  <PrototypeProvider>
    <Story />
  </PrototypeProvider>
);

export const demoLevels = DEFAULT_LEVEL_COLORS.slice(0, 5).map((preset, index) => ({
  id: `demo-level-${index}`,
  name: preset.name,
  color: preset.color,
}));

export const demoLocation: Location = {
  id: 'demo-location',
  name: 'Urban Climb West End, Montague Rd Brisbane',
  nickname: 'Home gym',
  isHome: true,
  levelSort: 'easy-hard',
  levels: demoLevels,
};

export const demoClimb: SessionClimb = {
  id: 'demo-climb-1',
  levelId: demoLevels[1].id,
  levelName: demoLevels[1].name,
  levelColor: demoLevels[1].color,
  name: 'Comp wall dyno',
  tags: ['dyno', 'crimpy'],
  notes: 'Big move off the volume.',
  hasImage: true,
  hasVideo: false,
  isWarmUp: false,
  isRepeat: false,
  isProject: true,
  attempts: [
    { id: 'demo-attempt-1', progress: ['start', 'middle'] },
    { id: 'demo-attempt-2', progress: ['send'] },
  ],
};

export const demoClimbMinimal: SessionClimb = {
  id: 'demo-climb-2',
  name: '',
  tags: [],
  hasImage: false,
  hasVideo: false,
  isWarmUp: true,
  isRepeat: true,
  isProject: false,
  attempts: [{ id: 'demo-attempt-3', progress: [] }],
};

export const demoClimbs: SessionClimb[] = [
  demoClimb,
  demoClimbMinimal,
  {
    id: 'demo-climb-3',
    levelId: demoLevels[3].id,
    levelName: demoLevels[3].name,
    levelColor: demoLevels[3].color,
    name: 'Slab traverse',
    tags: ['slab', 'balance'],
    hasImage: false,
    hasVideo: true,
    isWarmUp: false,
    isRepeat: false,
    isProject: false,
    attempts: [{ id: 'demo-attempt-4', progress: ['flash'] }],
  },
];
