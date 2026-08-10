import { useEffect, useMemo, useRef, useState } from 'react';

import { MOCK_EXISTING_USER } from '../../constants/mockData';
import { usesSupabaseBackend } from '../../config/backend';
import { useAuth } from '../../data/hooks/useAuth';
import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { getLoginIdentifierError } from '../../utils/validation';

import type { LoginViewProps } from './LoginView';

export type UseLoginOptions = {
  demo?: string;
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
};

export function useLogin({
  demo,
  onSuccess,
  onForgotPassword,
  onSignUp,
}: UseLoginOptions): LoginViewProps {
  const { email, setEmail, signInWithPassword } = useAuth();
  const { seedReturningUser } = useMockSeeding();
  const liveAuth = usesSupabaseBackend();
  const [identifier, setIdentifier] = useState(email);
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [remoteError, setRemoteError] = useState<string | undefined>();
  const initialized = useRef(false);

  useEffect(() => {
    if (demo === 'prefill') {
      setIdentifier(MOCK_EXISTING_USER.email);
      setEmail(MOCK_EXISTING_USER.email);
      setPassword(MOCK_EXISTING_USER.password);
      return;
    }
    if (demo === 'error-empty') {
      setIdentifier('');
      setPassword('');
      setTouched({ identifier: true, password: true });
      return;
    }
    if (initialized.current) return;
    if (email.trim()) {
      setIdentifier(email);
    }
    initialized.current = true;
  }, [demo, email, setEmail]);

  const identifierError = touched.identifier ? getLoginIdentifierError(identifier) : undefined;
  const passwordRequiredError =
    touched.password && !password.trim() ? 'Password is required' : undefined;

  const knownUserMatch = useMemo(() => {
    if (liveAuth) return false;
    const normalized = identifier.trim().toLowerCase();
    if (!normalized) return false;
    return (
      normalized === MOCK_EXISTING_USER.email ||
      normalized === MOCK_EXISTING_USER.username.toLowerCase()
    );
  }, [identifier, liveAuth]);

  const incorrectPasswordError =
    touched.password && knownUserMatch && password && password !== MOCK_EXISTING_USER.password
      ? 'Incorrect password'
      : undefined;

  const passwordError = passwordRequiredError || incorrectPasswordError || remoteError;

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    setEmail(value);
    setRemoteError(undefined);
    setTouched((current) => ({ ...current, identifier: true }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setRemoteError(undefined);
    setTouched((current) => ({ ...current, password: true }));
  };

  const handleLogin = async () => {
    setTouched({ identifier: true, password: true });
    setRemoteError(undefined);
    if (getLoginIdentifierError(identifier) || !password.trim()) return;

    if (liveAuth) {
      const result = await signInWithPassword(identifier.trim(), password);
      if (result.error) {
        setRemoteError(result.error);
        return;
      }
      onSuccess();
      return;
    }

    if (knownUserMatch && password !== MOCK_EXISTING_USER.password) return;

    if (knownUserMatch) {
      seedReturningUser();
    }

    onSuccess();
  };

  return {
    identifier,
    password,
    identifierError,
    passwordError,
    onIdentifierChange: handleIdentifierChange,
    onPasswordChange: handlePasswordChange,
    onLogin: handleLogin,
    onForgotPassword,
    onSignUp,
  };
}
