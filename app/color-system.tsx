import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ColorSystemDiagram, type ColorSystemFilter } from '../src/components/ColorSystemDiagram';
import { WireframeButton, WireframeScreen, WireframeSection } from '../src/components/Wireframe';
import { colors } from '../src/theme/colors';
import { scenarioWebLink } from '../src/constants/scenarios';

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: active ? colors.neutral[900] : colors.neutral[300],
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: active ? colors.neutral[100] : colors.neutral[50],
      }}
    >
      <Text style={{ fontWeight: active ? '700' : '400', fontSize: 14, color: colors.neutral[900] }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function ColorSystemPage() {
  const [filter, setFilter] = useState<ColorSystemFilter>('all');

  return (
    <WireframeScreen
      title="Colour system"
      footer={
        <>
          <WireframeButton label="Flow map" variant="secondary" onPress={() => router.push('/flow-map')} />
          <WireframeButton label="Back to welcome" variant="ghost" onPress={() => router.replace('/')} />
        </>
      }
    >
      <WireframeSection title="How to use">
        <Text style={{ color: colors.neutral[600], lineHeight: 22 }}>
          Live reference for design tokens in `src/theme/colors.ts`. Brand colours match climbing difficulty
          levels; neutral and semantic scales support UI surfaces and feedback. Token names map to the CSS-style
          convention in DesignSystem.md (e.g. `brand.blue.main`, `neutral.100`). Adjust tokens in the theme
          file — WCAG AA pass/fail recalculates automatically when this page reloads (hot reload in dev, or
          refresh the browser). No separate recheck step.
        </Text>
        <Text style={{ color: colors.neutral[500], fontSize: 13, marginTop: 8 }}>{scenarioWebLink('/color-system')}</Text>
      </WireframeSection>

      <WireframeSection title="Filter">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Brand" active={filter === 'brand'} onPress={() => setFilter('brand')} />
          <FilterChip label="Neutral" active={filter === 'neutral'} onPress={() => setFilter('neutral')} />
          <FilterChip label="Semantic" active={filter === 'semantic'} onPress={() => setFilter('semantic')} />
        </View>
      </WireframeSection>

      <ColorSystemDiagram filter={filter} />
    </WireframeScreen>
  );
}
