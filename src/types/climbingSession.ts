export type AttemptProgress = 'start' | 'middle' | 'end' | 'flash' | 'send';

export type ClimbAttempt = {
  id: string;
  progress: AttemptProgress[];
  notes?: string;
};

export type SessionClimb = {
  id: string;
  levelId?: string;
  levelName?: string;
  levelColor?: string;
  name?: string;
  tags: string[];
  notes?: string;
  hasImage: boolean;
  hasVideo: boolean;
  isWarmUp: boolean;
  isRepeat: boolean;
  isProject: boolean;
  attempts: ClimbAttempt[];
};

export type ClimbingSession = {
  id: string;
  status: 'active' | 'completed';
  date: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  locationId: string;
  locationName: string;
  climbs: SessionClimb[];
  isPublic: boolean;
  ownerUsername: string;
  ownerAvatar: string;
};

export type SessionSort =
  | 'order'
  | 'order-oldest'
  | 'difficulty'
  | 'difficulty-desc'
  | 'name'
  | 'name-desc';

export type TrendTimeframe = 'week' | 'month' | '3months';

export const PARTIAL_PROGRESS: AttemptProgress[] = ['start', 'middle', 'end'];
export const FULL_PROGRESS: AttemptProgress[] = ['flash', 'send'];

export const ATTEMPT_PROGRESS_OPTIONS: { value: AttemptProgress; label: string }[] = [
  { value: 'start', label: 'Start' },
  { value: 'middle', label: 'Middle' },
  { value: 'end', label: 'End' },
  { value: 'flash', label: 'Flash' },
  { value: 'send', label: 'Send' },
];

export const CLIMB_TAG_SUGGESTIONS = [
  'dyno',
  'slab',
  'overhang',
  'crimpy',
  'balance',
  'technical',
  'power',
];

export function formatAttemptProgress(progress: AttemptProgress[]) {
  if (progress.includes('flash')) return 'Flash';
  if (progress.includes('send')) return 'Send';
  if (progress.some((p) => PARTIAL_PROGRESS.includes(p))) return 'Partial';
  return '—';
}

/** Best result across attempts: Flash beats Send beats Partial. */
export function bestAttemptProgress(attempts: ClimbAttempt[]) {
  if (attempts.some((a) => a.progress.includes('flash'))) return 'Flash';
  if (attempts.some((a) => a.progress.includes('send'))) return 'Send';
  if (attempts.some((a) => a.progress.some((p) => PARTIAL_PROGRESS.includes(p)))) return 'Partial';
  return '—';
}

export function allAttemptsSummary(attempts: ClimbAttempt[]) {
  if (!attempts.length) return '—';
  return attempts.map((a) => formatAttemptProgress(a.progress)).join(' · ');
}

export function attemptProgressOptionsForIndex(index: number) {
  return ATTEMPT_PROGRESS_OPTIONS.filter((opt) => {
    if (opt.value === 'flash') return index === 0;
    if (opt.value === 'send') return index > 0;
    return true;
  });
}

export function nextAttemptProgress(
  current: AttemptProgress[],
  value: AttemptProgress,
): AttemptProgress[] {
  if (current.includes(value)) {
    return current.filter((p) => p !== value);
  }
  if (value === 'flash' || value === 'send') {
    return [value];
  }
  return [...current.filter((p) => !FULL_PROGRESS.includes(p)), value];
}
