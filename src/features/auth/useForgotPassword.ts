import { useState } from 'react';

import { usesSupabaseBackend } from '../../config/backend';
import { useAuth } from '../../data/hooks/useAuth';
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
  const { resetPasswordForEmail } = useAuth();
  const liveAuth = usesSupabaseBackend();
  const [email, setEmailLocal] = useState('');
  const [touched, setTouched] = useState(false);
  const [remoteError, setRemoteError] = useState<string | undefined>();

  const emailError = touched ? getEmailError(email) || remoteError : remoteError;

  const handleSend = async () => {
    setTouched(true);
    setRemoteError(undefined);
    if (getEmailError(email)) return;

    if (liveAuth) {
      const result = await resetPasswordForEmail(email.trim());
      if (result.error) {
        setRemoteError(result.error);
        return;
      }
    }

    onSuccess(email.trim());
  };

  return {
    email,
    emailError,
    onEmailChange: (value) => {
      setEmailLocal(value);
      setRemoteError(undefined);
      setTouched(true);
    },
    onSend: handleSend,
    onBackToLogin,
  };
}
