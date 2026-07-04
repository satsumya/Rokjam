export type AttemptProgress =
  | 'start'
  | 'middle'
  | 'end'
  | 'flash'
  | 'redpoint'
  | 'send'
  | 'working';

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

export type SessionSort = 'order' | 'difficulty' | 'name';
export type TrendTimeframe = 'week' | 'month' | '3months';

export const ATTEMPT_PROGRESS_OPTIONS: { value: AttemptProgress; label: string }[] = [
  { value: 'start', label: 'Start' },
  { value: 'middle', label: 'Middle' },
  { value: 'end', label: 'End' },
  { value: 'flash', label: 'Flash' },
  { value: 'redpoint', label: 'Redpoint' },
  { value: 'send', label: 'Send' },
  { value: 'working', label: 'Working' },
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
