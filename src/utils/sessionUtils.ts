import type {
  ClimbingSession,
  SessionClimb,
  SessionSort,
  TrendTimeframe,
} from '../types/climbingSession';
import type { DifficultyLevel } from '../context/PrototypeContext';

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

export const END_TIME_PRESETS = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export const DURATION_PRESETS: { label: string; minutes: number }[] = [
  { label: '30 mins', minutes: 30 },
  { label: '45 mins', minutes: 45 },
  { label: '1 hr', minutes: 60 },
  { label: '1.5 hr', minutes: 90 },
  { label: '2 hr', minutes: 120 },
  { label: '2.5 hr', minutes: 150 },
  { label: '3 hr', minutes: 180 },
];

export function nowTimeLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function parseTimeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

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

export function sortClimbs(climbs: SessionClimb[], sort: SessionSort, levels: DifficultyLevel[]) {
  const copy = [...climbs];
  if (sort === 'order') return copy;
  if (sort === 'name') {
    return copy.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  }
  return copy.sort((a, b) => {
    const ai = levelIndex(levels, a.levelId);
    const bi = levelIndex(levels, b.levelId);
    return ai - bi;
  });
}

export function filterClimbs(
  climbs: SessionClimb[],
  opts: {
    search?: string;
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
    if (opts.search) {
      const q = opts.search.toLowerCase();
      const hay = [climb.name, climb.notes, climb.levelName, ...climb.tags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
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
  if (climb.name) parts.push(climb.name);
  parts.push(`${climb.attempts.length} attempt${climb.attempts.length === 1 ? '' : 's'}`);
  const last = climb.attempts[climb.attempts.length - 1];
  if (last?.progress.length) parts.push(last.progress.join(', '));
  if (climb.isWarmUp) parts.push('warm-up');
  if (climb.isRepeat) parts.push('repeat');
  return parts.join(' · ');
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

  const byAttempts = [...climbs].sort((a, b) => b.attempts.length - a.attempts.length)[0];
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
