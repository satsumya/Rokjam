import { useAppData } from '../AppDataProvider';
import type { SessionRepository } from '../../domain/ports';

export function useSessions(): SessionRepository {
  const data = useAppData();
  return {
    sessions: data.sessions,
    startSession: data.startSession,
    updateSession: data.updateSession,
    completeSession: data.completeSession,
    deleteSession: data.deleteSession,
    getSession: data.getSession,
    addClimb: data.addClimb,
    updateClimb: data.updateClimb,
    removeClimb: data.removeClimb,
  };
}
