import { useMemo, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import {
  WireframeBox,
  WireframeButton,
  WireframeScreen,
  WireframeSection,
} from '../src/components/Wireframe';
import {
  MOCK_TEST_VALUES,
  SCENARIO_FLOWS,
  SCENARIOS,
  scenarioWebLink,
  type Scenario,
  type ScenarioFlow,
  type ScenarioUserType,
} from '../src/constants/scenarios';
import { usePrototype } from '../src/context/PrototypeContext';
import {
  applyScenarioSetup,
  filterScenarios,
  navigateScenarioPath,
  resolveScenarioSetup,
} from '../src/utils/scenarioSetup';

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
      style={{
        borderWidth: 1,
        borderColor: active ? '#111' : '#CCC',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: active ? '#F0F0F0' : '#FFF',
      }}
    >
      <Text style={{ fontWeight: active ? '700' : '400', fontSize: 14 }}>{label}</Text>
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
    <WireframeBox>
      <Text style={{ fontWeight: '700' }}>
        [{scenario.type}] {scenario.title}
      </Text>
      <Text style={{ color: '#666', fontSize: 13 }}>
        {effectiveUser === 'any' ? 'Any user' : effectiveUser === 'new' ? 'New user' : 'Existing user'} · Setup:{' '}
        {setup}
      </Text>
      <Text>{scenario.steps}</Text>
      <Text style={{ color: '#666', fontSize: 13 }}>{scenarioWebLink(scenario.path)}</Text>
      <WireframeButton label="Run scenario" onPress={() => onRun(scenario)} />
    </WireframeBox>
  );
}

export default function ScenariosScreen() {
  const { resetSession, seedReturningUser, seedDemoProfileOnly } = usePrototype();
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
    <WireframeScreen
      title="Scenario tester"
      footer={
        <WireframeButton label="Back to welcome" variant="secondary" onPress={() => router.replace('/')} />
      }
    >
      <WireframeSection title="Mock test values">
        <WireframeBox>
          <Text>Returning email: {MOCK_TEST_VALUES.returningEmail}</Text>
          <Text>Returning username: {MOCK_TEST_VALUES.returningUsername}</Text>
          <Text>Password: {MOCK_TEST_VALUES.password}</Text>
          <Text>Taken username: {MOCK_TEST_VALUES.takenUsername}</Text>
          <Text>Invalid verify code: {MOCK_TEST_VALUES.invalidVerifyCode}</Text>
          <Text>Address search: type “{MOCK_TEST_VALUES.addressSearchHint}”</Text>
        </WireframeBox>
      </WireframeSection>

      <WireframeSection title="Filter scenarios">
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>Flow</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
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
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>User</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <FilterChip label="All users" active={userFilter === 'all'} onPress={() => setUserFilter('all')} />
          <FilterChip label="New user" active={userFilter === 'new'} onPress={() => setUserFilter('new')} />
          <FilterChip
            label="Existing user"
            active={userFilter === 'existing'}
            onPress={() => setUserFilter('existing')}
          />
        </View>
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>Path type</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
      </WireframeSection>

      {grouped.length === 0 ? (
        <WireframeBox>
          <Text>No scenarios match the current filters.</Text>
        </WireframeBox>
      ) : (
        grouped.map((group) => (
          <WireframeSection key={group.id} title={group.doc}>
            {group.scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} userFilter={userFilter} onRun={handleRun} />
            ))}
          </WireframeSection>
        ))
      )}

      <WireframeSection title="Local web entry">
        <WireframeBox>
          <Text>App home: {scenarioWebLink('/')}</Text>
          <Text>This page: {scenarioWebLink('/scenarios')}</Text>
          <WireframeButton
            label="Open home in browser"
            variant="secondary"
            onPress={() => Linking.openURL(scenarioWebLink('/'))}
          />
        </WireframeBox>
      </WireframeSection>

      <WireframeSection title="Expo Go (device)">
        <WireframeBox>
          <Text>1. Run npm start in the Rokjam repo</Text>
          <Text>2. Scan the QR code with Expo Go</Text>
          <Text>3. Open Scenario tester from the welcome screen</Text>
          <Text>Base URL varies by machine — use the Metro URL shown in terminal.</Text>
        </WireframeBox>
      </WireframeSection>
    </WireframeScreen>
  );
}
