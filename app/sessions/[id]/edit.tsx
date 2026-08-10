import { router, useLocalSearchParams } from 'expo-router';

import { EditSessionView } from '../../../src/features/sessions/EditSessionView';
import { useEditSession } from '../../../src/features/sessions/useEditSession';

export default function EditSessionScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();

  return (
    <EditSessionView
      {...useEditSession({
        sessionId: id,
        demo,
        onSaved: () => router.replace(`/sessions/${id}`),
        onCancel: () => router.back(),
        onBack: () => router.back(),
      })}
    />
  );
}
