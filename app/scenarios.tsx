import { Linking, Text } from 'react-native';
import { router } from 'expo-router';

import {
  WireframeBox,
  WireframeButton,
  WireframeScreen,
  WireframeSection,
} from '../src/components/Wireframe';
import { LOCAL_WEB_BASE, SCENARIOS, scenarioWebLink, type Scenario } from '../src/constants/scenarios';

function ScenarioList({ ticket, title }: { ticket: Scenario['ticket']; title: string }) {
  const items = SCENARIOS.filter((s) => s.ticket === ticket);
  return (
    <WireframeSection title={title}>
      {items.map((scenario) => (
        <WireframeBox key={scenario.id}>
          <Text style={{ fontWeight: '700' }}>
            [{scenario.type}] {scenario.title}
          </Text>
          <Text>{scenario.steps}</Text>
          <Text style={{ color: '#666' }}>{scenarioWebLink(scenario.path)}</Text>
          <WireframeButton label="Run scenario" onPress={() => router.push(scenario.path as never)} />
        </WireframeBox>
      ))}
    </WireframeSection>
  );
}

export default function ScenariosScreen() {

  return (
    <WireframeScreen
      title="Scenario tester"
      footer={
        <WireframeButton label="Back to welcome" variant="secondary" onPress={() => router.replace('/')} />
      }
    >
      <WireframeSection title="Prototype entry links (local web)">
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

      <ScenarioList ticket="ROKJ-3" title="ROKJ-3 — Sign up / login" />
      <ScenarioList ticket="ROKJ-15" title="ROKJ-15 — Member profile" />
      <ScenarioList ticket="ROKJ-16" title="ROKJ-16 — Create climbing session" />
      <ScenarioList ticket="ROKJ-17" title="ROKJ-17 — View and edit sessions" />
      <ScenarioList ticket="ROKJ-18" title="ROKJ-18 — Dashboard trends" />
      <ScenarioList ticket="ROKJ-22" title="ROKJ-22 — Community" />

      <WireframeSection title="Expo Go (device)">
        <WireframeBox>
          <Text>1. Run npm start in the Rokjam repo</Text>
          <Text>2. Scan the QR code with Expo Go</Text>
          <Text>3. Open /scenarios from the welcome screen</Text>
          <Text>Base URL varies by machine — use the Metro URL shown in terminal.</Text>
        </WireframeBox>
      </WireframeSection>
    </WireframeScreen>
  );
}
