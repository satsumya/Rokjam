import { useState } from 'react';
import { router } from 'expo-router';

import { LogForm, type LogFormValues } from '../../src/components/LogForm';
import {
  WireframeButton,
  WireframeLink,
  WireframeScreen,
} from '../../src/components/Wireframe';
import { usePrototype } from '../../src/context/PrototypeContext';
import { isLogFormValid } from '../../src/utils/logValidation';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function CreateLogScreen() {
  const { locations, addClimbingLog } = usePrototype();
  const [values, setValues] = useState<LogFormValues>({
    locationId: locations[0]?.id ?? '',
    levelId: '',
    date: todayIso(),
    style: 'boulder',
    routeName: '',
    outcome: 'send',
    attempts: '',
    notes: '',
  });
  const [touched, setTouched] = useState<Partial<Record<keyof LogFormValues, boolean>>>({});

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

    const id = addClimbingLog({
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

    router.replace(`/logs/${id}`);
  };

  return (
    <WireframeScreen
      title="Log a climb"
      footer={
        <>
          <WireframeButton label="Save log" onPress={handleSave} />
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
