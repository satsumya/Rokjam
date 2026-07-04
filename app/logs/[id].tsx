import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  WireframeBox,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../src/components/Wireframe';
import { usePrototype } from '../../src/context/PrototypeContext';

export default function LogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { climbingLogs, deleteClimbingLog } = usePrototype();
  const log = climbingLogs.find((item) => item.id === id);

  if (!log) {
    return (
      <WireframeScreen
        title="Climbing log"
        footer={<WireframeLink label="Back to logs" onPress={() => router.replace('/logs')} />}
      >
        <WireframeBox>
          <Text>Log not found.</Text>
        </WireframeBox>
      </WireframeScreen>
    );
  }

  return (
    <WireframeScreen
      title="Climbing log"
      footer={
        <>
          <WireframeButton label="Edit log" onPress={() => router.push(`/logs/${log.id}/edit`)} />
          <WireframeButton
            label="Delete log"
            variant="secondary"
            onPress={() => {
              deleteClimbingLog(log.id);
              router.replace('/logs');
            }}
          />
          <WireframeLink label="Back to logs" onPress={() => router.replace('/logs')} />
        </>
      }
    >
      <WireframeSection title="Summary">
        <WireframeBox>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>
            {log.routeName || log.levelName}
          </Text>
          <Text>{log.date}</Text>
          <Text>{log.locationName}</Text>
        </WireframeBox>
      </WireframeSection>

      <WireframeSection title="Details">
        <WireframeBox>
          <DetailRow label="Level" value={log.levelName} color={log.levelColor} />
          <DetailRow label="Style" value={log.style.replace('-', ' ')} />
          <DetailRow label="Outcome" value={log.outcome} />
          {log.attempts ? <DetailRow label="Attempts" value={String(log.attempts)} /> : null}
          {log.notes ? <DetailRow label="Notes" value={log.notes} /> : null}
        </WireframeBox>
      </WireframeSection>
    </WireframeScreen>
  );
}

function DetailRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <Text>
      {label}: {color ? '■ ' : ''}
      {value}
    </Text>
  );
}
