import { TIME_INPUT_PLACEHOLDER } from './sessionUtils';

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function getEmailError(value: string) {
  if (!value.trim()) return 'Email is required';
  if (!value.includes('@')) return 'Email must include @';
  if (!isValidEmail(value)) return 'Enter a valid email address';
  return undefined;
}

export function getPasswordErrors(value: string) {
  const errors: string[] = [];
  if (value.length < 8) errors.push('At least 8 characters');
  if (!/[0-9]/.test(value)) errors.push('At least one number');
  if (!/[^A-Za-z0-9]/.test(value)) errors.push('At least one symbol');
  return errors;
}

export function isPasswordValid(value: string) {
  return getPasswordErrors(value).length === 0;
}

export function getLoginIdentifierError(value: string) {
  if (!value.trim()) return 'Email or username is required';
  return undefined;
}

export function isVerificationCodeValid(code: string) {
  return /^\d{6}$/.test(code) && code !== '000000';
}

export function getVerificationCodeError(code: string) {
  if (!code.trim()) return 'Enter the 6-digit code';
  if (!/^\d{6}$/.test(code)) return 'Code must be 6 digits';
  if (code === '000000') return 'Invalid code. Try again or resend.';
  return undefined;
}

export function getUsernameError(value: string, takenUsernames: string[]) {
  if (!value.trim()) return undefined;
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) return 'Use 3–20 letters, numbers, or underscores';
  if (takenUsernames.includes(value.toLowerCase())) return 'Username is already taken';
  return undefined;
}

export function sanitizeTimeInput(value: string) {
  return value.replace(/[^0-9:apmAPM\s]/g, '').slice(0, 8);
}

export function isValidTimeLabel(value: string) {
  return !getTimeLabelError(value);
}

export function normalizeTimeLabel(value: string) {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return trimmed;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (hours < 1 || hours > 12 || minutes > 59) return trimmed;
  return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function getTimeLabelError(value: string) {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) return `Enter a time (e.g. ${TIME_INPUT_PLACEHOLDER})`;
  if (!/^[\d:apmAPM\s]+$/.test(trimmed)) {
    return `Use numbers, a colon, and AM or PM (e.g. ${TIME_INPUT_PLACEHOLDER})`;
  }
  if (!trimmed.includes(':')) return `Use h:mm AM/PM format (e.g. ${TIME_INPUT_PLACEHOLDER})`;

  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM)?)?$/i);
  if (!match) return `Use h:mm AM/PM format (e.g. ${TIME_INPUT_PLACEHOLDER})`;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (hours < 1 || hours > 12) return 'Hour must be between 1 and 12';
  if (minutes > 59) return 'Minutes must be between 00 and 59';
  if (match[2].length < 2) return 'Minutes must be two digits (e.g. 6:05 PM)';
  if (!period) return 'Include AM or PM';

  return undefined;
}
