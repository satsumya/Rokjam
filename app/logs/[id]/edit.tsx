import { useState } from 'react';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { LogForm, type LogFormValues } from '../../../src/components/LogForm';
import {
  WireframeBox,
  WireframeButton,
  WireframeLink,
  WireframeScreen,
} from '../../../src/components/Wireframe';
import { usePrototype } from '../../../src/context/PrototypeContext';
import { isLogFormValid } from '../../../src/utils/logValidation';

export default function EditLogScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { climbingLogs, locations, updateClimbingLog } = usePrototype();
  const log = climbingLogs.find((item) => item.id === id);

  const [values, setValues] = useState<LogFormValues>(() => ({
    locationId: log?.locationId ?? '',
    levelId: log?.levelId ?? '',
    date: log?.date ?? '',
    style: log?.style ?? 'boulder',
    routeName: log?.routeName ?? '',
    outcome: log?.outcome ?? 'send',
    attempts: log?.attempts ? String(log.attempts) : '',
    notes: log?.notes ?? '',
  }));
  const [touched, setTouched] = useState<Partial<Record<keyof LogFormValues, boolean>>>({});

  if (!log) {
    return (
      <WireframeScreen
        title="Edit log"
        footer={<WireframeLink label="Back to logs" onPress={() => router.replace('/logs')} />}
      >
        <WireframeBox>
          <Text>Log not found.</Text>
        </WireframeBox>
      </WireframeScreen>
    );
  }

  const handleSave = () => {
    setTouched({
      locationId: true,
      levelId: true,
      date: true,
      attempts: true,
    });
    if (!isLogFormValid(values)) return;

    const location = locations.find((loc) => loc.id === values.locationId);
    const level = location?.levels.find((item) => item.id === values.levelId);
    if (!location || !level) return;

    updateClimbingLog(log.id, {
      locationId: location.id,
      locationName: location.name,
      levelId: level.id,
      levelName: level.name,
      levelColor: level.color,
      date: values.date,
      style: values.style,
      routeName: values.routeName.trim() || undefined,
      outcome: values.outcome,
      attempts:
        values.outcome === 'working' || values.outcome === 'project'
          ? Number(values.attempts)
          : undefined,
      notes: values.notes.trim() || undefined,
    });

    router.replace(`/logs/${log.id}`);
  };

  return (
    <WireframeScreen
      title="Edit log"
      footer={
        <>
          <WireframeButton label="Save changes" onPress={handleSave} />
          <WireframeLink label="Cancel" onPress={() => router.back()} />
        </>
      }
    >
      <LogForm
        locations={locations}
        values={values}
        touched={touched}
        onChange={(patch) => setValues((current) => ({ ...current, ...patch }))}
        onTouch={(field) => setTouched((current) => ({ ...current, [field]: true }))}
      />
    </WireframeScreen>
  );
}
