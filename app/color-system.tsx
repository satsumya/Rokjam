import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Screen, Section, Text } from '../src/components';
import { ColorSystemDiagram, type ColorSystemFilter } from '../src/components/utility';
import { PrototypeRoute } from '../src/components/utility/PrototypeRoute';
import { colors } from '../src/theme/colors';
import {
  FIGMA_COLOR_TOKENS_FILENAME,
  stringifyFigmaColorTokens,
} from '../src/theme/exportFigmaColorTokens';
import { interactionStyle } from '../src/theme/interaction';
import { scenarioWebLink } from '../src/constants/scenarios';
import { downloadTextFile } from '../src/utils/downloadTextFile';
import { space } from '../src/theme/spacing';

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
      style={(state) => [
        {
          borderWidth: 1,
          borderColor: active ? colors.neutral[900] : colors.neutral[300],
          borderRadius: 16,
          paddingHorizontal: space[12],
          paddingVertical: space[6],
          backgroundColor: active ? colors.neutral[100] : colors.neutral[50],
        },
        interactionStyle(state),
      ]}
    >
      <Text variant="body" weight={active ? 'bold' : 'regular'} color={colors.neutral[900]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function ColorSystemPage() {
  const [filter, setFilter] = useState<ColorSystemFilter>('all');

  return (
    <PrototypeRoute>
    <Screen
      title="Colour system"
      wide
      footer={
        <>
          <Button label="Icon library" variant="secondary" onPress={() => router.push('/icon-library')} />
          <Button label="Typography" variant="ghost" onPress={() => router.push('/typography')} />
          <Button label="Flow map" variant="ghost" onPress={() => router.push('/flow-map')} />
          <Button label="Back to welcome" variant="ghost" onPress={() => router.replace('/')} />
        </>
      }
    >
      <Section title="How to use">
        <Text variant="body" color={colors.neutral[600]}>
          Live reference for design tokens in `src/theme/colors.ts`. Brand colours match climbing difficulty
          levels; neutral and semantic scales support UI surfaces and feedback. Token names map to the CSS-style
          convention in DesignSystem.md (e.g. `brand.blue.main`, `neutral.100`). Adjust tokens in the theme
          file — WCAG AA pass/fail recalculates automatically when this page reloads (hot reload in dev, or
          refresh the browser). No separate recheck step.
        </Text>
        <Text variant="bodySmall" color={colors.neutral[500]} style={{ marginTop: space[8] }}>
          {scenarioWebLink('/color-system')}
        </Text>
      </Section>

      <Section title="Export for Figma">
        <Text variant="body" color={colors.neutral[600]}>
          {`Downloads a W3C Design Tokens (DTCG) JSON file of brand, neutral, semantic, and UI colours. In Figma, open a variables import plugin that accepts DTCG JSON (e.g. Variables JSON Import, Tokens Brücke, or tokenHaus) and upload ${FIGMA_COLOR_TOKENS_FILENAME}.`}
        </Text>
        <View style={{ marginTop: space[12], alignItems: 'flex-start' }}>
          <Button
            label="Export colour tokens"
            variant="secondary"
            onPress={() => {
              void downloadTextFile(stringifyFigmaColorTokens(), FIGMA_COLOR_TOKENS_FILENAME);
            }}
          />
        </View>
      </Section>

      <Section title="Filter">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
          <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Brand" active={filter === 'brand'} onPress={() => setFilter('brand')} />
          <FilterChip label="Neutral" active={filter === 'neutral'} onPress={() => setFilter('neutral')} />
          <FilterChip label="Semantic" active={filter === 'semantic'} onPress={() => setFilter('semantic')} />
        </View>
      </Section>

      <ColorSystemDiagram filter={filter} />
    </Screen>
    </PrototypeRoute>
  );
}
