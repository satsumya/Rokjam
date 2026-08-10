import { useState } from 'react';

import { getEmailError } from '../../utils/validation';

import type { ForgotPasswordViewProps } from './ForgotPasswordView';

export type UseForgotPasswordOptions = {
  onSuccess: (email: string) => void;
  onBackToLogin: () => void;
};

export function useForgotPassword({
  onSuccess,
  onBackToLogin,
}: UseForgotPasswordOptions): ForgotPasswordViewProps {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const emailError = touched ? getEmailError(email) : undefined;

  const handleSend = () => {
    setTouched(true);
    if (getEmailError(email)) return;
    onSuccess(email.trim());
  };

  return {
    email,
    emailError,
    onEmailChange: (value) => {
      setEmail(value);
      setTouched(true);
    },
    onSend: handleSend,
    onBackToLogin,
  };
}
