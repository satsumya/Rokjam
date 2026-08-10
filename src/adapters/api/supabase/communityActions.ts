import type { ClimbingSession } from '../../../types/climbingSession';
import { getSupabaseClient } from './client';
import { mapSessionRow, type SessionRow } from './sessionMappers';

export async function fetchPublicSessions(excludeUserId: string): Promise<ClimbingSession[]> {
  const { data, error } = await getSupabaseClient()
    .from('sessions')
    .select('*, session_climbs(*)')
    .eq('status', 'completed')
    .eq('is_public', true)
    .neq('user_id', excludeUserId)
    .order('session_date', { ascending: false });

  if (error) throw error;

  return ((data ?? []) as SessionRow[]).map((row) =>
    mapSessionRow(row, row.owner_username ?? '', row.owner_avatar ?? ''),
  );
}

export async function fetchFollowedUsernames(userId: string): Promise<string[]> {
  const { data, error } = await getSupabaseClient()
    .from('follows')
    .select('followed_username')
    .eq('follower_id', userId);

  if (error) throw error;
  return (data ?? []).map((row) => row.followed_username);
}

export async function followUser(userId: string, username: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('follows')
    .upsert({ follower_id: userId, followed_username: username }, { onConflict: 'follower_id,followed_username' });

  if (error) throw error;
}

export async function unfollowUser(userId: string, username: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('follows')
    .delete()
    .eq('follower_id', userId)
    .eq('followed_username', username);

  if (error) throw error;
}
