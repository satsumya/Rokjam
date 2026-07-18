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

/** True when the username meets format rules and is not in the taken list. */
export function isUsernameAvailable(value: string, takenUsernames: string[]) {
  return Boolean(value.trim()) && !getUsernameError(value, takenUsernames);
}
