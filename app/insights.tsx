import { useLocalSearchParams } from 'expo-router';

import { InsightsView } from '../src/features/dashboard/InsightsView';
import { useInsights } from '../src/features/dashboard/useInsights';

export default function InsightsScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();

  return <InsightsView {...useInsights({ demo })} />;
}
