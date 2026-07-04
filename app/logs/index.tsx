import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { LogSummaryRow } from '../../src/components/TrendSummary';
import {
  WireframeBox,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../src/components/Wireframe';
import { usePrototype } from '../../src/context/PrototypeContext';

export default function LogListScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const { climbingLogs, seedDemoLogs } = usePrototype();

  useEffect(() => {
    if (demo === 'seed' && climbingLogs.length === 0) {
      seedDemoLogs();
    }
  }, [climbingLogs.length, demo, seedDemoLogs]);

  return (
    <WireframeScreen
      title="Climbing logs"
      headerRight={
        <Pressable onPress={() => router.back()}>
          <Text style={{ textDecorationLine: 'underline' }}>Back</Text>
        </Pressable>
      }
      footer={
        <>
          <WireframeButton label="Log a climb" onPress={() => router.push('/logs/create')} />
          <WireframeLink label="Back to dashboard" onPress={() => router.replace('/dashboard')} />
        </>
      }
    >
      {climbingLogs.length === 0 ? (
        <WireframeBox>
          <Text style={{ fontWeight: '700' }}>No logs yet</Text>
          <Text>Log your first climb to start tracking progress.</Text>
        </WireframeBox>
      ) : (
        <WireframeSection title="Recent climbs">
          {climbingLogs.map((log) => (
            <Pressable key={log.id} onPress={() => router.push(`/logs/${log.id}`)}>
              <WireframeBox>
                <LogSummaryRow log={log} />
              </WireframeBox>
            </Pressable>
          ))}
        </WireframeSection>
      )}
    </WireframeScreen>
  );
}
