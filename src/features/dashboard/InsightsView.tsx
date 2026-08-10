import { BottomNav, DashboardTrends, Screen, Text } from '../../components';
import type { Location } from '../../context/PrototypeContext';
import { ui } from '../../theme/colors';
import type { ClimbingSession, TrendTimeframe } from '../../types/climbingSession';

export type InsightsViewProps = {
  needsProfile: boolean;
  sessions: ClimbingSession[];
  locations: Location[];
  timeframe: TrendTimeframe;
  onTimeframeChange: (timeframe: TrendTimeframe) => void;
};

export function InsightsView({
  needsProfile,
  sessions,
  locations,
  timeframe,
  onTimeframeChange,
}: InsightsViewProps) {
  return (
    <Screen title="Insights" bottomNav={<BottomNav active="insights" />}>
      {needsProfile ? (
        <Text variant="body" color={ui.textMuted}>
          Complete your profile to unlock climbing trends.
        </Text>
      ) : (
        <DashboardTrends
          sessions={sessions}
          locations={locations}
          timeframe={timeframe}
          onTimeframeChange={onTimeframeChange}
        />
      )}
    </Screen>
  );
}
