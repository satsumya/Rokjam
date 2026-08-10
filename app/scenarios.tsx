import { useMemo, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Card, Screen, Section, Text } from '../src/components';
import { ui } from '../src/theme/colors';
import { interactionStyle } from '../src/theme/interaction';
import {
  MOCK_TEST_VALUES,
  SCENARIO_FLOWS,
  SCENARIOS,
  scenarioWebLink,
  type Scenario,
  type ScenarioFlow,
  type ScenarioUserType,
} from '../src/constants/scenarios';
import { useMockSeeding } from '../src/data/hooks/useMockSeeding';
import {
  applyScenarioSetup,
  filterScenarios,
  navigateScenarioPath,
  resolveScenarioSetup,
} from '../src/utils/scenarioSetup';
import { space } from '../src/theme/spacing';

type PathFilter = ScenarioFlow | 'all';
type UserFilter = ScenarioUserType | 'all';
type TypeFilter = Scenario['type'] | 'all';

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

function ScenarioCard({
  scenario,
  userFilter,
  onRun,
}: {
  scenario: Scenario;
  userFilter: UserFilter;
  onRun: (scenario: Scenario) => void;
}) {
  const effectiveUser =
    scenario.userType === 'any'
      ? userFilter === 'all'
        ? 'any'
        : userFilter
      : scenario.userType;
  const setup = resolveScenarioSetup(scenario, userFilter);

  return (
    <Card>
      <Text variant="body" weight="bold">
        [{scenario.type}] {scenario.title}
      </Text>
      <Text variant="bodySmall" color={ui.textMuted}>
        {effectiveUser === 'any' ? 'Any user' : effectiveUser === 'new' ? 'New user' : 'Existing user'} · Setup:{' '}
        {setup}
      </Text>
      <Text variant="body">{scenario.steps}</Text>
      <Text variant="bodySmall" color={ui.textMuted}>
        {scenarioWebLink(scenario.path)}
      </Text>
      <Button label="Run scenario" onPress={() => onRun(scenario)} />
    </Card>
  );
}

export default function ScenariosScreen() {
  const { resetSession, seedReturningUser, seedDemoProfileOnly } = useMockSeeding();
  const [flowFilter, setFlowFilter] = useState<PathFilter>('all');
  const [userFilter, setUserFilter] = useState<UserFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const visibleScenarios = useMemo(
    () => filterScenarios(SCENARIOS, { flow: flowFilter, userType: userFilter, type: typeFilter }),
    [flowFilter, userFilter, typeFilter],
  );

  const grouped = useMemo(() => {
    const map = new Map<ScenarioFlow, Scenario[]>();
    for (const flow of SCENARIO_FLOWS) {
      map.set(flow.id, []);
    }
    for (const scenario of visibleScenarios) {
      map.get(scenario.flow)?.push(scenario);
    }
    return SCENARIO_FLOWS.filter((flow) => (map.get(flow.id)?.length ?? 0) > 0).map((flow) => ({
      ...flow,
      scenarios: map.get(flow.id) ?? [],
    }));
  }, [visibleScenarios]);

  const handleRun = (scenario: Scenario) => {
    const setup = resolveScenarioSetup(scenario, userFilter);
    applyScenarioSetup(setup, { resetSession, seedReturningUser, seedDemoProfileOnly });
    navigateScenarioPath(scenario.path);
  };

  return (
    <Screen
      title="Scenario tester"
      wide
      footer={
        <Button label="Back to welcome" variant="secondary" onPress={() => router.replace('/')} />
      }
    >
      <Section title="Flow map">
        <Card>
          <Text variant="body">
            See how screens connect across each flow. Tap any screen to jump to that point in the journey with
            the right app state.
          </Text>
          <Button label="Open flow map" onPress={() => router.push('/flow-map')} />
          <Text variant="bodySmall" color={ui.textMuted} style={{ marginTop: space[8] }}>
            {scenarioWebLink('/flow-map')}
          </Text>
        </Card>
      </Section>

      <Section title="Colour system">
        <Card>
          <Text variant="body">
            Preview brand, neutral, and semantic colour tokens — including contrast and alpha variants.
          </Text>
          <Button label="Open colour system" onPress={() => router.push('/color-system')} />
          <Text variant="bodySmall" color={ui.textMuted} style={{ marginTop: space[8] }}>
            {scenarioWebLink('/color-system')}
          </Text>
        </Card>
      </Section>

      <Section title="Icon library">
        <Card>
          <Text variant="body">
            Browse every icon in use, the size scale, and each Phosphor weight — see whether iconography stays
            on regular or mixes bold, fill, and more.
          </Text>
          <Button label="Open icon library" onPress={() => router.push('/icon-library')} />
          <Text variant="bodySmall" color={ui.textMuted} style={{ marginTop: space[8] }}>
            {scenarioWebLink('/icon-library')}
          </Text>
        </Card>
      </Section>

      <Section title="Typography">
        <Card>
          <Text variant="body">
            Preview the type scale — six heading sizes and three body sizes on one modular scale — switch weight
            and view real copy in each style.
          </Text>
          <Button label="Open typography" onPress={() => router.push('/typography')} />
          <Text variant="bodySmall" color={ui.textMuted} style={{ marginTop: space[8] }}>
            {scenarioWebLink('/typography')}
          </Text>
        </Card>
      </Section>

      <Section title="Mock test values">
        <Card>
          <Text variant="body">Returning email: {MOCK_TEST_VALUES.returningEmail}</Text>
          <Text variant="body">Returning username: {MOCK_TEST_VALUES.returningUsername}</Text>
          <Text variant="body">Password: {MOCK_TEST_VALUES.password}</Text>
          <Text variant="body">Taken username: {MOCK_TEST_VALUES.takenUsername}</Text>
          <Text variant="body">Invalid verify code: {MOCK_TEST_VALUES.invalidVerifyCode}</Text>
          <Text variant="body">Address search: type “{MOCK_TEST_VALUES.addressSearchHint}”</Text>
        </Card>
      </Section>

      <Section title="Filter scenarios">
        <Text variant="body" weight="bold" style={{ marginBottom: space[6] }}>
          Flow
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8], marginBottom: space[12] }}>
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
        <Text variant="body" weight="bold" style={{ marginBottom: space[6] }}>
          User
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8], marginBottom: space[12] }}>
          <FilterChip label="All users" active={userFilter === 'all'} onPress={() => setUserFilter('all')} />
          <FilterChip label="New user" active={userFilter === 'new'} onPress={() => setUserFilter('new')} />
          <FilterChip
            label="Existing user"
            active={userFilter === 'existing'}
            onPress={() => setUserFilter('existing')}
          />
        </View>
        <Text variant="body" weight="bold" style={{ marginBottom: space[6] }}>
          Path type
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
          <FilterChip label="All paths" active={typeFilter === 'all'} onPress={() => setTypeFilter('all')} />
          <FilterChip
            label="Happy path"
            active={typeFilter === 'Happy path'}
            onPress={() => setTypeFilter('Happy path')}
          />
          <FilterChip
            label="Alternate path"
            active={typeFilter === 'Alternate path'}
            onPress={() => setTypeFilter('Alternate path')}
          />
          <FilterChip
            label="Error path"
            active={typeFilter === 'Error path'}
            onPress={() => setTypeFilter('Error path')}
          />
        </View>
      </Section>

      {grouped.length === 0 ? (
        <Card>
          <Text variant="body">No scenarios match the current filters.</Text>
        </Card>
      ) : (
        grouped.map((group) => (
          <Section key={group.id} title={group.doc}>
            {group.scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} userFilter={userFilter} onRun={handleRun} />
            ))}
          </Section>
        ))
      )}

      <Section title="Local web entry">
        <Card>
          <Text variant="body">App home: {scenarioWebLink('/')}</Text>
          <Text variant="body">This page: {scenarioWebLink('/scenarios')}</Text>
          <Button
            label="Open home in browser"
            variant="secondary"
            onPress={() => Linking.openURL(scenarioWebLink('/'))}
          />
        </Card>
      </Section>

      <Section title="Expo Go (device)">
        <Card>
          <Text variant="body">1. Run npm start in the Rokjam repo</Text>
          <Text variant="body">2. Scan the QR code with Expo Go</Text>
          <Text variant="body">3. Open Scenario tester from the welcome screen</Text>
          <Text variant="body">Base URL varies by machine — use the Metro URL shown in terminal.</Text>
        </Card>
      </Section>
    </Screen>
  );
}
