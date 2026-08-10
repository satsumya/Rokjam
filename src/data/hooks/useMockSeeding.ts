import { useAppData } from '../AppDataProvider';
import type { MockSeedingRepository } from '../../domain/ports';

export function useMockSeeding(): MockSeedingRepository {
  const data = useAppData();
  return {
    seedDemoSessions: data.seedDemoSessions,
    seedDemoActiveSession: data.seedDemoActiveSession,
    seedFlowDemo: data.seedFlowDemo,
    seedDemoProfileOnly: data.seedDemoProfileOnly,
    seedReturningUser: data.seedReturningUser,
    resetSession: data.resetSession,
  };
}
