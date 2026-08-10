import type { ClimbingSession, SessionClimb } from '../../../types/climbingSession';
import { getSupabaseClient } from './client';
import {
  climbToRow,
  mapSessionRow,
  sessionPatchToRow,
  sessionToRow,
  type SessionRow,
} from './sessionMappers';

export async function fetchUserSessions(
  userId: string,
  ownerUsername: string,
  ownerAvatar: string,
): Promise<ClimbingSession[]> {
  const { data, error } = await getSupabaseClient()
    .from('sessions')
    .select('*, session_climbs(*)')
    .eq('user_id', userId)
    .order('session_date', { ascending: false });

  if (error) throw error;

  return ((data ?? []) as SessionRow[]).map((row) =>
    mapSessionRow(row, ownerUsername, ownerAvatar),
  );
}

export async function insertSession(userId: string, session: ClimbingSession): Promise<void> {
  const { error } = await getSupabaseClient().from('sessions').insert(sessionToRow(userId, session));
  if (error) throw error;
}

export async function updateSessionRecord(
  userId: string,
  sessionId: string,
  patch: Partial<ClimbingSession>,
): Promise<void> {
  const rowPatch = sessionPatchToRow(patch);
  if (Object.keys(rowPatch).length <= 1) return;

  const { error } = await getSupabaseClient()
    .from('sessions')
    .update(rowPatch)
    .eq('id', sessionId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteSessionRecord(userId: string, sessionId: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function insertClimb(
  sessionId: string,
  climb: SessionClimb,
  sortOrder: number,
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('session_climbs')
    .insert(climbToRow(sessionId, climb, sortOrder));

  if (error) throw error;
}

export async function updateClimbRecord(
  sessionId: string,
  climbId: string,
  climb: SessionClimb,
  sortOrder: number,
): Promise<void> {
  const { id: _id, session_id: _sessionId, ...rowPatch } = climbToRow(sessionId, climb, sortOrder);
  const { error } = await getSupabaseClient()
    .from('session_climbs')
    .update(rowPatch)
    .eq('id', climbId)
    .eq('session_id', sessionId);

  if (error) throw error;
}

export async function deleteClimbRecord(sessionId: string, climbId: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('session_climbs')
    .delete()
    .eq('id', climbId)
    .eq('session_id', sessionId);

  if (error) throw error;
}
