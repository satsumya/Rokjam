import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { SCENARIO_FLOWS } from '../src/constants/scenarios';
import type { ScenarioFlow } from '../src/constants/scenarios';
import { Button, Screen, Section, Text } from '../src/components';
import { FlowMapDiagram } from '../src/components/utility';
import { useAuth } from '../src/data/hooks/useAuth';
import { useMockSeeding } from '../src/data/hooks/useMockSeeding';
import { ui } from '../src/theme/colors';
import { interactionStyle } from '../src/theme/interaction';
import { space } from '../src/theme/spacing';

type FlowFilter = ScenarioFlow | 'all';

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
          borderColor: active ? ui.borderStrong : ui.border,
          borderRadius: 16,
          paddingHorizontal: space[12],
          paddingVertical: space[6],
          backgroundColor: active ? ui.surfaceMuted : ui.surface,
        },
        interactionStyle(state),
      ]}
    >
      <Text variant="body" weight={active ? 'bold' : 'regular'}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function FlowMapPage() {
  const { setEmail } = useAuth();
  const seeding = useMockSeeding();
  const [flowFilter, setFlowFilter] = useState<FlowFilter>('all');

  const navigateCtx = {
    resetSession: seeding.resetSession,
    seedReturningUser: seeding.seedReturningUser,
    seedDemoProfileOnly: seeding.seedDemoProfileOnly,
    seedDemoSessions: seeding.seedDemoSessions,
    seedDemoActiveSession: seeding.seedDemoActiveSession,
    seedFlowDemo: seeding.seedFlowDemo,
    setEmail,
  };

  return (
    <Screen
      title="Flow map"
      wide
      footer={
        <>
          <Button
            label="Scenario tester"
            variant="secondary"
            onPress={() => router.push('/scenarios')}
          />
          <Button label="Back to welcome" variant="ghost" onPress={() => router.replace('/')} />
        </>
      }
    >
      <Section title="How to use">
        <Text variant="body" color={ui.textMuted}>
          Journeys read left to right. The first screen in each column shares the same top edge so the main path
          is easy to scan; alternate paths stack below. Scroll horizontally within a journey when the diagram
          is wider than your screen. Tap a screen thumbnail to jump into the app at that point
          with the right test data loaded. Use **Update** (green) to refresh a screenshot after UI changes,
          **Update all** on a flow section for that journey, or **Update all flows** at the top for every
          screen across the map — patch versions bump automatically when the image changed.
          Requires `npm run flow-map-capture-server` in a second terminal.
          Use Download for PNG exports — filenames follow the screen naming convention in Standards (label, optional descriptors, version).
          Expand **Version info** on a flow section to see version numbers and last-updated timestamps.
        </Text>
      </Section>

      <Section title="Filter by flow">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
          <FilterChip label="All flows" active={flowFilter === 'all'} onPress={() => setFlowFilter('all')} />
          {SCENARIO_FLOWS.map((flow) => (
            <FilterChip
              key={flow.id}
              label={flow.doc}
              active={flowFilter === flow.id}
              onPress={() => setFlowFilter(flow.id)}
            />
          ))}
        </View>
      </Section>

      <FlowMapDiagram navigateCtx={navigateCtx} journeyFilter={flowFilter} />
    </Screen>
  );
}
