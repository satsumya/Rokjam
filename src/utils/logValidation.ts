import type { ClimbOutcome, ClimbStyle } from '../types/climbingLog';

export function getLogLocationError(locationId: string) {
  if (!locationId) return 'Select a location';
  return undefined;
}

export function getLogLevelError(levelId: string) {
  if (!levelId) return 'Select a difficulty level';
  return undefined;
}

export function getLogDateError(date: string) {
  if (!date.trim()) return 'Date is required';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Use YYYY-MM-DD';
  return undefined;
}

export function getLogAttemptsError(outcome: ClimbOutcome, attempts: string) {
  if (outcome !== 'working' && outcome !== 'project') return undefined;
  if (!attempts.trim()) return 'Attempts required for working/project';
  const value = Number(attempts);
  if (!Number.isInteger(value) || value < 1) return 'Enter a whole number of attempts';
  return undefined;
}

export function isLogFormValid(input: {
  locationId: string;
  levelId: string;
  date: string;
  style: ClimbStyle;
  outcome: ClimbOutcome;
  attempts: string;
}) {
  return (
    !getLogLocationError(input.locationId) &&
    !getLogLevelError(input.levelId) &&
    !getLogDateError(input.date) &&
    !getLogAttemptsError(input.outcome, input.attempts)
  );
}
