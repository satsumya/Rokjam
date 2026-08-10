import type { ClimbAttempt, ClimbingSession, SessionClimb } from '../../../types/climbingSession';

export type SessionRow = {
  id: string;
  user_id: string;
  status: 'active' | 'completed';
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  location_id: string | null;
  location_name: string;
  is_public: boolean;
  owner_username?: string;
  owner_avatar?: string;
  session_climbs?: ClimbRow[] | null;
};

export type ClimbRow = {
  id: string;
  session_id: string;
  level_id: string | null;
  level_name: string | null;
  level_color: string | null;
  name: string | null;
  tags: string[];
  notes: string | null;
  has_image: boolean;
  has_video: boolean;
  is_warm_up: boolean;
  is_repeat: boolean;
  is_project: boolean;
  sort_order: number;
  attempts: ClimbAttempt[];
};

export function mapClimbRow(row: ClimbRow): SessionClimb {
  return {
    id: row.id,
    levelId: row.level_id ?? undefined,
    levelName: row.level_name ?? undefined,
    levelColor: row.level_color ?? undefined,
    name: row.name ?? undefined,
    tags: row.tags ?? [],
    notes: row.notes ?? undefined,
    hasImage: row.has_image,
    hasVideo: row.has_video,
    isWarmUp: row.is_warm_up,
    isRepeat: row.is_repeat,
    isProject: row.is_project,
    attempts: Array.isArray(row.attempts) ? row.attempts : [],
  };
}

export function mapSessionRow(
  row: SessionRow,
  ownerUsername: string,
  ownerAvatar: string,
): ClimbingSession {
  const climbs = [...(row.session_climbs ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapClimbRow);

  return {
    id: row.id,
    status: row.status,
    date: row.session_date,
    startTime: row.start_time ?? '',
    endTime: row.end_time ?? undefined,
    durationMinutes: row.duration_minutes ?? undefined,
    locationId: row.location_id ?? '',
    locationName: row.location_name,
    climbs,
    isPublic: row.is_public,
    ownerUsername: row.owner_username || ownerUsername,
    ownerAvatar: row.owner_avatar || ownerAvatar,
  };
}

export function climbToRow(sessionId: string, climb: SessionClimb, sortOrder: number) {
  return {
    id: climb.id,
    session_id: sessionId,
    level_id: climb.levelId || null,
    level_name: climb.levelName ?? null,
    level_color: climb.levelColor ?? null,
    name: climb.name ?? null,
    tags: climb.tags,
    notes: climb.notes ?? null,
    has_image: climb.hasImage,
    has_video: climb.hasVideo,
    is_warm_up: climb.isWarmUp,
    is_repeat: climb.isRepeat,
    is_project: climb.isProject,
    sort_order: sortOrder,
    attempts: climb.attempts,
  };
}

export function sessionToRow(userId: string, session: ClimbingSession) {
  return {
    id: session.id,
    user_id: userId,
    status: session.status,
    session_date: session.date,
    start_time: session.startTime || null,
    end_time: session.endTime ?? null,
    duration_minutes: session.durationMinutes ?? null,
    location_id: session.locationId || null,
    location_name: session.locationName,
    is_public: session.isPublic,
    owner_username: session.ownerUsername,
    owner_avatar: session.ownerAvatar,
    updated_at: new Date().toISOString(),
  };
}

export function sessionPatchToRow(patch: Partial<ClimbingSession>): Record<string, unknown> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.date !== undefined) row.session_date = patch.date;
  if (patch.startTime !== undefined) row.start_time = patch.startTime || null;
  if (patch.endTime !== undefined) row.end_time = patch.endTime ?? null;
  if (patch.durationMinutes !== undefined) row.duration_minutes = patch.durationMinutes ?? null;
  if (patch.locationId !== undefined) row.location_id = patch.locationId || null;
  if (patch.locationName !== undefined) row.location_name = patch.locationName;
  if (patch.isPublic !== undefined) row.is_public = patch.isPublic;
  if (patch.ownerUsername !== undefined) row.owner_username = patch.ownerUsername;
  if (patch.ownerAvatar !== undefined) row.owner_avatar = patch.ownerAvatar;
  return row;
}

export function climbPatchToRow(patch: Partial<SessionClimb>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.levelId !== undefined) row.level_id = patch.levelId || null;
  if (patch.levelName !== undefined) row.level_name = patch.levelName ?? null;
  if (patch.levelColor !== undefined) row.level_color = patch.levelColor ?? null;
  if (patch.name !== undefined) row.name = patch.name ?? null;
  if (patch.tags !== undefined) row.tags = patch.tags;
  if (patch.notes !== undefined) row.notes = patch.notes ?? null;
  if (patch.hasImage !== undefined) row.has_image = patch.hasImage;
  if (patch.hasVideo !== undefined) row.has_video = patch.hasVideo;
  if (patch.isWarmUp !== undefined) row.is_warm_up = patch.isWarmUp;
  if (patch.isRepeat !== undefined) row.is_repeat = patch.isRepeat;
  if (patch.isProject !== undefined) row.is_project = patch.isProject;
  if (patch.attempts !== undefined) row.attempts = patch.attempts;
  return row;
}
