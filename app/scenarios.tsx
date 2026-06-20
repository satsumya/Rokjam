import { Linking, Text } from 'react-native';
import { router } from 'expo-router';

import {
  WireframeBox,
  WireframeButton,
  WireframeScreen,
  WireframeSection,
} from '../src/components/Wireframe';
import { LOCAL_WEB_BASE, SCENARIOS, scenarioWebLink } from '../src/constants/scenarios';

export default function ScenariosScreen() {
  const rok3 = SCENARIOS.filter((s) => s.ticket === 'ROKJ-3');
  const rok15 = SCENARIOS.filter((s) => s.ticket === 'ROKJ-15');

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

      <WireframeSection title="ROKJ-3 — Sign up / login">
        {rok3.map((scenario) => (
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

      <WireframeSection title="ROKJ-15 — Member profile">
        {rok15.map((scenario) => (
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
