import { useEffect, useRef, useState } from 'react';

import { TAKEN_EMAILS } from '../../constants/mockData';
import { usesSupabaseBackend } from '../../config/backend';
import { useAuth } from '../../data/hooks/useAuth';
import { getSignUpEmailError, isPasswordValid } from '../../utils/validation';

import type { SignUpViewProps } from './SignUpView';

export type UseSignUpOptions = {
  demo?: string;
  onSuccess: () => void;
  onLogIn: () => void;
};

export function useSignUp({ demo, onSuccess, onLogIn }: UseSignUpOptions): SignUpViewProps {
  const { email, setEmail, signUpWithPassword } = useAuth();
  const liveAuth = usesSupabaseBackend();
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [remoteError, setRemoteError] = useState<string | undefined>();
  const initialized = useRef(false);

  useEffect(() => {
    if (demo === 'error-empty') {
      setTouched({ email: true, password: true });
      return;
    }
    if (initialized.current) return;
    setPassword('');
    setTouched({ email: Boolean(email.trim()), password: false });
    initialized.current = true;
  }, [demo, email]);

  const emailError =
    touched.email ? getSignUpEmailError(email, liveAuth ? [] : TAKEN_EMAILS) || remoteError : remoteError;
  const passwordError =
    touched.password && !isPasswordValid(password) ? 'Password does not meet requirements' : undefined;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setRemoteError(undefined);
    setTouched((current) => ({ ...current, email: true }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setTouched((current) => ({ ...current, password: true }));
  };

  const handleSignUp = async () => {
    setTouched({ email: true, password: true });
    setRemoteError(undefined);
    if (!liveAuth && getSignUpEmailError(email, TAKEN_EMAILS)) return;
    if (liveAuth && getSignUpEmailError(email, [])) return;
    if (!isPasswordValid(password)) return;

    if (liveAuth) {
      const result = await signUpWithPassword(email.trim(), password);
      if (result.error) {
        setRemoteError(result.error);
        return;
      }
      onSuccess();
      return;
    }

    onSuccess();
  };

  return {
    email,
    password,
    emailError,
    passwordError,
    onEmailChange: handleEmailChange,
    onPasswordChange: handlePasswordChange,
    onSignUp: handleSignUp,
    onLogIn,
  };
}
