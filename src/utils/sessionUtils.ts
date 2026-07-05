import type { DifficultyLevel } from '../context/PrototypeContext';
import type {
  ClimbingSession,
  SessionClimb,
  SessionSort,
  TrendTimeframe,
} from '../types/climbingSession';
import { bestAttemptProgress } from '../types/climbingSession';

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatSessionDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  return `${DAY_NAMES[d.getDay()]} ${dd} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

/** Parse display format (Day DD Mmm YYYY) back to ISO date. Returns null if invalid. */
export function parseSessionDateDisplay(display: string) {
  const trimmed = display.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length < 4) return null;
  const dd = parts[parts.length - 3];
  const mon = parts[parts.length - 2];
  const yyyy = parts[parts.length - 1];
  const month = MONTH_NAMES.indexOf(mon);
  if (month < 0 || !/^\d{2}$/.test(dd) || !/^\d{4}$/.test(yyyy)) return null;
  const d = new Date(`${yyyy}-${String(month + 1).padStart(2, '0')}-${dd}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export const END_TIME_PRESETS = [
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
];

export const TIME_INPUT_PLACEHOLDER = '6:30 PM';

export function formatTimeLabel(hours24: number, minutes: number) {
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function nowTimeLabel() {
  const d = new Date();
  return formatTimeLabel(d.getHours(), d.getMinutes());
}

export function parseTimeToMinutes(time: string) {
  const trimmed = time.trim();
  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hours = Number(ampm[1]);
    const minutes = Number(ampm[2]);
    const period = ampm[3].toUpperCase();
    if (hours < 1 || hours > 12 || minutes > 59) return 0;
    if (period === 'AM') {
      if (hours === 12) hours = 0;
    } else if (hours !== 12) {
      hours += 12;
    }
    return hours * 60 + minutes;
  }

  const h24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) {
    const hours = Number(h24[1]);
    const minutes = Number(h24[2]);
    if (hours > 23 || minutes > 59) return 0;
    return hours * 60 + minutes;
  }

  return 0;
}

export const DURATION_PRESETS: { label: string; minutes: number }[] = [
  { label: '30 mins', minutes: 30 },
  { label: '45 mins', minutes: 45 },
  { label: '1 hr', minutes: 60 },
  { label: '1.5 hr', minutes: 90 },
  { label: '2 hr', minutes: 120 },
  { label: '2.5 hr', minutes: 150 },
  { label: '3 hr', minutes: 180 },
];

export function formatDuration(minutes?: number) {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function computeDurationMinutes(startTime: string, endTime?: string, fallback?: number) {
  if (fallback && fallback > 0) return fallback;
  if (!endTime) return undefined;
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (end >= start) return end - start;
  return 24 * 60 - start + end;
}

export function levelIndex(levels: DifficultyLevel[], levelId?: string) {
  if (!levelId) return -1;
  return levels.findIndex((l) => l.id === levelId);
}

function hasDifficulty(climb: SessionClimb) {
  return Boolean(climb.levelId);
}

function hasName(climb: SessionClimb) {
  return Boolean(climb.name?.trim());
}

export function sortClimbs(climbs: SessionClimb[], sort: SessionSort, levels: DifficultyLevel[]) {
  const copy = [...climbs];

  if (sort === 'order') {
    return copy.reverse();
  }
  if (sort === 'order-oldest') {
    return copy;
  }
  if (sort === 'name' || sort === 'name-desc') {
    const dir = sort === 'name' ? 1 : -1;
    return copy.sort((a, b) => {
      const aNamed = hasName(a);
      const bNamed = hasName(b);
      if (!aNamed && bNamed) return -1;
      if (aNamed && !bNamed) return 1;
      if (!aNamed && !bNamed) return 0;
      return dir * (a.name ?? '').localeCompare(b.name ?? '');
    });
  }

  const dir = sort === 'difficulty' ? 1 : -1;
  return copy.sort((a, b) => {
    const aLabelled = hasDifficulty(a);
    const bLabelled = hasDifficulty(b);
    if (!aLabelled && bLabelled) return -1;
    if (aLabelled && !bLabelled) return 1;
    if (!aLabelled && !bLabelled) return 0;
    const ai = levelIndex(levels, a.levelId);
    const bi = levelIndex(levels, b.levelId);
    return dir * (ai - bi);
  });
}

export function filterClimbs(
  climbs: SessionClimb[],
  opts: {
    difficultyId?: string;
    tag?: string;
    hideWarmUp?: boolean;
    hideRepeat?: boolean;
  },
) {
  return climbs.filter((climb) => {
    if (opts.hideWarmUp && climb.isWarmUp) return false;
    if (opts.hideRepeat && climb.isRepeat) return false;
    if (opts.difficultyId && climb.levelId !== opts.difficultyId) return false;
    if (opts.tag && !climb.tags.includes(opts.tag)) return false;
    return true;
  });
}

export function sessionDifficultyRange(climbs: SessionClimb[], levels: DifficultyLevel[]) {
  const indices = climbs
    .map((c) => levelIndex(levels, c.levelId))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  if (!indices.length) return '—';
  const low = levels[indices[0]];
  const high = levels[indices[indices.length - 1]];
  if (low.id === high.id) return low.name;
  return `${low.name}–${high.name}`;
}

export function climbSummary(climb: SessionClimb) {
  const parts: string[] = [];
  if (climb.levelName) parts.push(climb.levelName);
  const best = bestAttemptProgress(climb.attempts);
  if (best !== '—') parts.push(best);
  if (climb.attempts.length) {
    parts.push(`${climb.attempts.length} attempt${climb.attempts.length === 1 ? '' : 's'}`);
  }
  return parts.length ? parts.join(' · ') : 'No attempts yet';
}

export function climbHasDetails(climb: SessionClimb) {
  if (climb.name?.trim()) return true;
  if (climb.levelId) return true;
  if (climb.tags.length) return true;
  if (climb.notes?.trim()) return true;
  if (climb.hasImage || climb.hasVideo) return true;
  if (climb.isWarmUp || climb.isRepeat || climb.isProject) return true;
  if (climb.attempts.some((attempt) => attempt.progress.length > 0)) return true;
  return false;
}

export function sessionsInTimeframe(sessions: ClimbingSession[], timeframe: TrendTimeframe) {
  const now = new Date();
  const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return sessions.filter((s) => s.status === 'completed' && s.date >= cutoffStr);
}

export type StandoutTrend = { label: string; detail: string };

export function computeStandoutTrends(
  sessions: ClimbingSession[],
  timeframe: TrendTimeframe,
): StandoutTrend[] {
  const scoped = sessionsInTimeframe(sessions, timeframe);
  const climbs = scoped.flatMap((s) => s.climbs.map((c) => ({ ...c, sessionDate: s.date })));
  const trends: StandoutTrend[] = [];

  const dyno = climbs.find((c) => c.tags.includes('dyno'));
  if (dyno) trends.push({ label: 'First dyno', detail: `${dyno.name ?? 'Unnamed'} on ${dyno.sessionDate}` });

  const orange = climbs.find((c) => c.levelName?.toLowerCase() === 'orange');
  if (orange) {
    const sent = orange.attempts.some((a) => a.progress.includes('send') || a.progress.includes('flash'));
    if (sent) trends.push({ label: 'First Orange send', detail: orange.name ?? 'Unnamed climb' });
  }

  const projects = climbs.filter((c) => c.isProject || c.attempts.length >= 3);
  const byAttempts = [...projects].sort((a, b) => b.attempts.length - a.attempts.length)[0];
  if (byAttempts && byAttempts.attempts.length >= 3) {
    trends.push({
      label: 'Most attempted project',
      detail: `${byAttempts.name ?? 'Project'} (${byAttempts.attempts.length} attempts)`,
    });
  }

  const flashes = climbs.filter((c) => c.attempts.some((a) => a.progress.includes('flash')));
  if (flashes.length) {
    const hardest = flashes.sort((a, b) => (b.levelName ?? '').localeCompare(a.levelName ?? ''))[0];
    trends.push({ label: 'Hardest flash', detail: `${hardest.levelName ?? '?'} ${hardest.name ?? ''}`.trim() });
  }

  return trends.slice(0, 4);
}

export function durationTrend(sessions: ClimbingSession[], timeframe: TrendTimeframe) {
  const scoped = sessionsInTimeframe(sessions, timeframe);
  return scoped.map((s) => ({
    label: s.date.slice(5),
    value: computeDurationMinutes(s.startTime, s.endTime, s.durationMinutes) ?? 0,
  }));
}

export function warmUpTrend(sessions: ClimbingSession[], timeframe: TrendTimeframe) {
  const scoped = sessionsInTimeframe(sessions, timeframe);
  return scoped.map((s) => ({
    label: s.date.slice(5),
    value: s.climbs.filter((c) => c.isWarmUp).length,
  }));
}
