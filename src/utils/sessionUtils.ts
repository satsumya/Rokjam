import type { DifficultyLevel } from '../context/PrototypeContext';
import type {
  ClimbingSession,
  SessionClimb,
  SessionSort,
  TrendTimeframe,
} from '../types/climbingSession';
import { bestAttemptProgress } from '../types/climbingSession';
import { ui } from '../theme/colors';

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

export function formatTimeLabel(hours24: number, minutes: number) {
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
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

export function snapTimeToQuarterHours(hours24: number, minutes: number) {
  let total = hours24 * 60 + minutes;
  total = Math.round(total / 15) * 15;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return formatTimeLabel(Math.floor(total / 60), total % 60);
}

export const TIME_DROPDOWN_VALUES: string[] = (() => {
  const values: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 15) {
      values.push(formatTimeLabel(hour, minute));
    }
  }
  return values;
})();

export const TIME_DROPDOWN_OPTIONS = TIME_DROPDOWN_VALUES.map((value) => ({
  value,
  label: value,
}));

/** Map any h:mm AM/PM value to the nearest 15-minute dropdown option. */
export function resolveTimeDropdownValue(time: string) {
  const trimmed = time.trim();
  if (!trimmed) return TIME_DROPDOWN_VALUES[0];
  if (TIME_DROPDOWN_VALUES.includes(trimmed)) return trimmed;
  const totalMinutes = parseTimeToMinutes(trimmed);
  const hours24 = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return snapTimeToQuarterHours(hours24, mins);
}

export function nowTimeLabel() {
  const d = new Date();
  return snapTimeToQuarterHours(d.getHours(), d.getMinutes());
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

/** True when any climb at this location already has a difficulty level assigned. */
export function locationHasGradedSessionClimbs(
  sessions: ClimbingSession[],
  locationId: string,
): boolean {
  return sessions.some(
    (session) =>
      session.locationId === locationId &&
      session.climbs.some((climb) => Boolean(climb.levelId)),
  );
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
  const { cutoffStr } = timeframeWindow(timeframe);
  return sessions.filter((s) => s.status === 'completed' && s.date >= cutoffStr);
}

function isoFromDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Inclusive calendar window used by trend filters (cutoff day → today). */
export function timeframeWindow(timeframe: TrendTimeframe, now = new Date()) {
  const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return {
    days,
    start,
    end,
    cutoffStr: isoFromDate(start),
    endStr: isoFromDate(end),
  };
}

/** Human range under the timeframe tabs — e.g. "12 – 18 Jul", "Jun", "Apr – Jul". */
export function timeframeRangeLabel(timeframe: TrendTimeframe, now = new Date()) {
  const { start, end } = timeframeWindow(timeframe, now);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = MONTH_NAMES[start.getMonth()];
  const endMonth = MONTH_NAMES[end.getMonth()];
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  if (timeframe === 'week') {
    if (sameMonth) return `${startDay} – ${endDay} ${endMonth}`;
    return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
  }

  if (sameMonth) return startMonth;
  return `${startMonth} – ${endMonth}`;
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

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export type HeatmapDay = {
  date: string;
  minutes: number;
  level: HeatmapLevel;
  inRange: boolean;
};

export type DurationHeatmap = {
  weeks: HeatmapDay[][];
  monthLabels: { label: string; weekIndex: number }[];
  totalMinutes: number;
};

function startOfWeekSunday(d: Date) {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function durationHeatLevel(minutes: number): HeatmapLevel {
  if (minutes <= 0) return 0;
  if (minutes < 60) return 1;
  if (minutes < 120) return 2;
  if (minutes < 180) return 3;
  return 4;
}

/**
 * GitHub-style week columns of climbing minutes (intensity by duration).
 * Weeks start on Sunday; month labels sit above the week that contains the 1st.
 */
export function durationHeatmap(
  sessions: ClimbingSession[],
  timeframe: TrendTimeframe,
  now = new Date(),
): DurationHeatmap {
  const { cutoffStr, endStr } = timeframeWindow(timeframe, now);
  const scoped = sessions.filter(
    (s) => s.status === 'completed' && s.date >= cutoffStr && s.date <= endStr,
  );

  const minutesByDate = new Map<string, number>();
  let totalMinutes = 0;
  for (const session of scoped) {
    const minutes =
      computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes) ?? 0;
    if (minutes <= 0) continue;
    totalMinutes += minutes;
    minutesByDate.set(session.date, (minutesByDate.get(session.date) ?? 0) + minutes);
  }

  const rangeStart = new Date(`${cutoffStr}T12:00:00`);
  const rangeEnd = new Date(`${endStr}T12:00:00`);
  const cursor = startOfWeekSunday(rangeStart);
  const last = startOfWeekSunday(rangeEnd);
  last.setDate(last.getDate() + 6);

  const days: HeatmapDay[] = [];
  const walk = new Date(cursor);
  while (walk <= last) {
    const date = isoFromDate(walk);
    const inRange = date >= cutoffStr && date <= endStr;
    const minutes = inRange ? (minutesByDate.get(date) ?? 0) : 0;
    days.push({
      date,
      minutes,
      level: inRange ? durationHeatLevel(minutes) : 0,
      inRange,
    });
    walk.setDate(walk.getDate() + 1);
  }

  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const anchor =
      week.find((day) => day.inRange && new Date(`${day.date}T12:00:00`).getDate() === 1) ??
      (weekIndex === 0 ? week.find((day) => day.inRange) : undefined);
    if (!anchor) return;
    const month = new Date(`${anchor.date}T12:00:00`).getMonth();
    if (month === lastMonth) return;
    lastMonth = month;
    monthLabels.push({ label: MONTH_NAMES[month], weekIndex });
  });

  return { weeks, monthLabels, totalMinutes };
}

export function warmUpTrend(sessions: ClimbingSession[], timeframe: TrendTimeframe) {
  const scoped = sessionsInTimeframe(sessions, timeframe);
  return scoped.map((s) => ({
    label: s.date.slice(5),
    value: s.climbs.filter((c) => c.isWarmUp).length,
  }));
}

export type DifficultySlice = {
  levelId: string;
  name: string;
  color: string;
  value: number;
};

export type LocationDifficultyTrend = {
  locationId: string;
  label: string;
  isHome: boolean;
  slices: DifficultySlice[];
};

function locationTrendLabel(location: {
  nickname?: string;
  name: string;
  isHome: boolean;
}): string {
  if (location.nickname?.trim()) return location.nickname.trim();
  const short = location.name.split(',')[0]?.trim();
  return short || location.name;
}

/**
 * Difficulty climb counts per location for the timeframe, using each climb’s
 * level colour. Locations with no graded climbs are omitted. Home is listed first.
 */
export function difficultyTrendByLocation(
  sessions: ClimbingSession[],
  timeframe: TrendTimeframe,
  locations: {
    id: string;
    name: string;
    nickname?: string;
    isHome: boolean;
    levels: { id: string; name: string; color: string }[];
  }[],
): LocationDifficultyTrend[] {
  const scoped = sessionsInTimeframe(sessions, timeframe);
  const trends: LocationDifficultyTrend[] = [];

  for (const location of locations) {
    const locationSessions = scoped.filter((session) => session.locationId === location.id);
    const counts = new Map<string, { name: string; color: string; value: number }>();

    for (const session of locationSessions) {
      for (const climb of session.climbs) {
        if (!climb.levelId && !climb.levelName) continue;
        const key = climb.levelId || `name:${climb.levelName}`;
        const fromProfile = climb.levelId
          ? location.levels.find((level) => level.id === climb.levelId)
          : undefined;
        const name = climb.levelName ?? fromProfile?.name ?? 'Unknown';
        const color = climb.levelColor || fromProfile?.color || ui.textSubtle;
        const existing = counts.get(key);
        if (existing) {
          existing.value += 1;
        } else {
          counts.set(key, { name, color, value: 1 });
        }
      }
    }

    if (counts.size === 0) continue;

    const slices: DifficultySlice[] = [...counts.entries()].map(([levelId, slice]) => ({
      levelId,
      name: slice.name,
      color: slice.color,
      value: slice.value,
    }));

    // Prefer profile level order when the level still exists.
    slices.sort((a, b) => {
      const ai = location.levels.findIndex((level) => level.id === a.levelId);
      const bi = location.levels.findIndex((level) => level.id === b.levelId);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return a.name.localeCompare(b.name);
    });

    trends.push({
      locationId: location.id,
      label: locationTrendLabel(location),
      isHome: location.isHome,
      slices,
    });
  }

  // Include sessions at unknown / deleted location ids (use session.locationName).
  const knownIds = new Set(locations.map((loc) => loc.id));
  const orphanSessions = scoped.filter(
    (session) => session.locationId && !knownIds.has(session.locationId),
  );
  const orphanByLocation = new Map<string, ClimbingSession[]>();
  for (const session of orphanSessions) {
    const list = orphanByLocation.get(session.locationId) ?? [];
    list.push(session);
    orphanByLocation.set(session.locationId, list);
  }
  for (const [locationId, locationSessions] of orphanByLocation) {
    const counts = new Map<string, { name: string; color: string; value: number }>();
    for (const session of locationSessions) {
      for (const climb of session.climbs) {
        if (!climb.levelId && !climb.levelName) continue;
        const key = climb.levelId || `name:${climb.levelName}`;
        const name = climb.levelName ?? 'Unknown';
        const color = climb.levelColor || ui.textSubtle;
        const existing = counts.get(key);
        if (existing) existing.value += 1;
        else counts.set(key, { name, color, value: 1 });
      }
    }
    if (counts.size === 0) continue;
    trends.push({
      locationId,
      label: locationSessions[0]?.locationName?.split(',')[0]?.trim() || 'Other location',
      isHome: false,
      slices: [...counts.entries()].map(([levelId, slice]) => ({
        levelId,
        name: slice.name,
        color: slice.color,
        value: slice.value,
      })),
    });
  }

  trends.sort((a, b) => {
    if (a.isHome !== b.isHome) return a.isHome ? -1 : 1;
    return a.label.localeCompare(b.label);
  });

  return trends;
}

/** Prefer home gym with data; otherwise the first location that has slices. */
export function defaultDifficultyTrendLocationId(
  trends: LocationDifficultyTrend[],
): string | undefined {
  if (!trends.length) return undefined;
  const home = trends.find((trend) => trend.isHome);
  if (home) return home.locationId;
  return trends[0].locationId;
}
