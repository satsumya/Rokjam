import { useEffect, useRef, useState } from 'react';

import { TAKEN_EMAILS } from '../../constants/mockData';
import { useAuth } from '../../data/hooks/useAuth';
import { getSignUpEmailError, isPasswordValid } from '../../utils/validation';

import type { SignUpViewProps } from './SignUpView';

export type UseSignUpOptions = {
  demo?: string;
  onSuccess: () => void;
  onLogIn: () => void;
};

export function useSignUp({ demo, onSuccess, onLogIn }: UseSignUpOptions): SignUpViewProps {
  const { email, setEmail } = useAuth();
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
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

  const emailError = touched.email ? getSignUpEmailError(email, TAKEN_EMAILS) : undefined;
  const passwordError =
    touched.password && !isPasswordValid(password) ? 'Password does not meet requirements' : undefined;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setTouched((current) => ({ ...current, email: true }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setTouched((current) => ({ ...current, password: true }));
  };

  const handleSignUp = () => {
    setTouched({ email: true, password: true });
    if (getSignUpEmailError(email, TAKEN_EMAILS) || !isPasswordValid(password)) return;
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
