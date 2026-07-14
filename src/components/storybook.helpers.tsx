import type { Decorator } from '@storybook/react-native';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { PrototypeProvider } from '../context/PrototypeContext';
import type { Location } from '../context/PrototypeContext';
import { DEFAULT_LEVEL_COLORS } from '../constants/difficultyLevels';
import type { ClimbingSession, SessionClimb } from '../types/climbingSession';
import { ui } from '../theme/colors';
import type { PreviewState } from '../theme/interaction';
import { space } from '../theme/spacing';

/** The interaction states demoable via the `previewState` prop / control. */
export const PREVIEW_STATES: PreviewState[] = ['default', 'hover', 'pressed', 'focused'];

/** Shared Storybook control for forcing a component's interaction state. */
export const previewStateArgType = {
  control: { type: 'select' as const },
  options: PREVIEW_STATES,
};

export type StatesGalleryVariant = {
  id: string;
  label: string;
};

/**
 * Renders interaction states for a component. Pass `variants` to show a labelled
 * section per visual variant (e.g. primary / secondary / disabled), each with
 * default · hover · pressed · focused.
 */
export function StatesGallery({
  variants,
  children,
}: {
  variants?: readonly StatesGalleryVariant[];
  children: (state: PreviewState, variantId: string) => ReactNode;
}) {
  const sections: readonly StatesGalleryVariant[] = variants?.length
    ? variants
    : [{ id: 'default', label: '' }];

  return (
    <View style={{ gap: space[24], alignItems: 'flex-start' }}>
      {sections.map((section) => (
        <View key={section.id} style={{ gap: space[12], alignItems: 'flex-start' }}>
          {section.label ? (
            <Text style={{ fontSize: 13, fontWeight: '700', color: ui.text }}>{section.label}</Text>
          ) : null}
          {PREVIEW_STATES.map((state) => (
            <View key={state} style={{ gap: space[4], alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: ui.textMuted }}>{state}</Text>
              {children(state, section.id)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** Pads stories and gives them the app background so components sit on-brand. */
export const Padded: Decorator = (Story) => (
  <ScrollView
    style={{ flex: 1, backgroundColor: ui.background }}
    contentContainerStyle={{ padding: space[16], gap: space[12] }}
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

export const demoSessions: ClimbingSession[] = [
  {
    id: 'demo-session-1',
    status: 'completed',
    date: '2026-07-01',
    startTime: '5:30 PM',
    endTime: '7:00 PM',
    durationMinutes: 90,
    locationId: demoLocation.id,
    locationName: demoLocation.name,
    climbs: demoClimbs,
    isPublic: true,
    ownerUsername: 'demo_climber',
    ownerAvatar: '🪨',
  },
  {
    id: 'demo-session-2',
    status: 'completed',
    date: '2026-06-27',
    startTime: '6:00 PM',
    endTime: '7:15 PM',
    durationMinutes: 75,
    locationId: demoLocation.id,
    locationName: demoLocation.name,
    climbs: [demoClimb],
    isPublic: true,
    ownerUsername: 'demo_climber',
    ownerAvatar: '🪨',
  },
];
