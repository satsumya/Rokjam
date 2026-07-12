import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { FlowMapDiagram } from '../src/components/FlowMapDiagram';
import { SCENARIO_FLOWS } from '../src/constants/scenarios';
import type { ScenarioFlow } from '../src/constants/scenarios';
import { WireframeButton, WireframeScreen, WireframeSection } from '../src/components/Wireframe';
import { usePrototype } from '../src/context/PrototypeContext';
import { ui } from '../src/theme/colors';

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
      style={{
        borderWidth: 1,
        borderColor: active ? ui.borderStrong : ui.border,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: active ? ui.surfaceMuted : ui.surface,
      }}
    >
      <Text style={{ fontWeight: active ? '700' : '400', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

export default function FlowMapPage() {
  const prototype = usePrototype();
  const [flowFilter, setFlowFilter] = useState<FlowFilter>('all');

  const navigateCtx = {
    resetSession: prototype.resetSession,
    seedReturningUser: prototype.seedReturningUser,
    seedDemoProfileOnly: prototype.seedDemoProfileOnly,
    seedDemoSessions: prototype.seedDemoSessions,
    seedDemoActiveSession: prototype.seedDemoActiveSession,
    seedFlowDemo: prototype.seedFlowDemo,
    setEmail: prototype.setEmail,
  };

  return (
    <WireframeScreen
      title="Flow map"
      footer={
        <>
          <WireframeButton
            label="Scenario tester"
            variant="secondary"
            onPress={() => router.push('/scenarios')}
          />
          <WireframeButton label="Back to welcome" variant="ghost" onPress={() => router.replace('/')} />
        </>
      }
    >
      <WireframeSection title="How to use">
        <Text style={{ color: ui.textMuted, lineHeight: 22 }}>
          Journeys read left to right. The first screen in each column shares the same top edge so the main path
          is easy to scan; alternate paths stack below. Scroll horizontally within a journey when the diagram
          is wider than your screen. Tap a screen thumbnail to jump into the app at that point
          with the right test data loaded. Use **Update** (green) to refresh a screenshot after UI changes,
          or **Update all** on a flow section — patch versions bump automatically when the image changed.
          Requires `npm run flow-map-capture-server` in a second terminal.
          Use Download for PNG exports — filenames follow the screen naming convention in Standards (label, optional descriptors, version).
          Expand **Version info** on a flow section to see version numbers and last-updated timestamps.
        </Text>
      </WireframeSection>

      <WireframeSection title="Filter by flow">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
      </WireframeSection>

      <FlowMapDiagram navigateCtx={navigateCtx} journeyFilter={flowFilter} />
    </WireframeScreen>
  );
}
