import { useState } from 'react';

import { isPasswordValid } from '../../utils/validation';

import type { ResetPasswordViewProps } from './ResetPasswordView';

export type UseResetPasswordOptions = {
  email?: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
};

export function useResetPassword({
  email,
  onSuccess,
  onBackToLogin,
}: UseResetPasswordOptions): ResetPasswordViewProps {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const passwordInvalid = touched.password && !isPasswordValid(password);
  const confirmError =
    touched.confirm && confirm !== password ? 'Passwords must match' : undefined;

  const handleReset = () => {
    setTouched({ password: true, confirm: true });
    if (!isPasswordValid(password) || confirm !== password) return;
    onSuccess();
  };

  return {
    email,
    password,
    confirm,
    passwordError: passwordInvalid ? 'Password does not meet requirements' : undefined,
    confirmError,
    onPasswordChange: (value) => {
      setPassword(value);
      setTouched((current) => ({ ...current, password: true }));
    },
    onConfirmChange: (value) => {
      setConfirm(value);
      setTouched((current) => ({ ...current, confirm: true }));
    },
    onReset: handleReset,
    onBackToLogin,
  };
}
