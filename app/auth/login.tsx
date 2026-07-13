import { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, Link, Screen, Text, TextField } from '../../src/components';
import { ui } from '../../src/theme/colors';
import { MOCK_EXISTING_USER } from '../../src/constants/mockData';
import { usePrototype } from '../../src/context/PrototypeContext';
import { getLoginIdentifierError } from '../../src/utils/validation';

export default function LoginScreen() {
  const { demo, existing } = useLocalSearchParams<{ demo?: string; existing?: string }>();
  const { seedReturningUser } = usePrototype();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ identifier: false, password: false });

  useEffect(() => {
    if (existing === '1') {
      setIdentifier(MOCK_EXISTING_USER.email);
      setTouched({ identifier: true, password: false });
    }
    if (demo === 'prefill') {
      setIdentifier(MOCK_EXISTING_USER.email);
      setPassword(MOCK_EXISTING_USER.password);
    }
    if (demo === 'error-empty') {
      setIdentifier('');
      setPassword('');
      setTouched({ identifier: true, password: true });
    }
  }, [demo, existing]);

  const identifierError = touched.identifier ? getLoginIdentifierError(identifier) : undefined;
  const passwordRequiredError = touched.password && !password.trim() ? 'Password is required' : undefined;

  const knownUserMatch = useMemo(() => {
    const normalized = identifier.trim().toLowerCase();
    if (!normalized) return false;
    return (
      normalized === MOCK_EXISTING_USER.email ||
      normalized === MOCK_EXISTING_USER.username.toLowerCase()
    );
  }, [identifier]);

  const incorrectPasswordError =
    touched.password && knownUserMatch && password && password !== MOCK_EXISTING_USER.password
      ? 'Incorrect password'
      : undefined;

  const passwordError = passwordRequiredError || incorrectPasswordError;

  const handleLogin = () => {
    setTouched({ identifier: true, password: true });
    if (getLoginIdentifierError(identifier) || !password.trim()) return;

    if (knownUserMatch && password !== MOCK_EXISTING_USER.password) return;

    if (knownUserMatch) {
      seedReturningUser();
      router.replace('/dashboard');
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <Screen
      title="Log in"
      footer={
        <>
          <Button label="Log in" onPress={handleLogin} />
          <Link
            label="Forgot password?"
            onPress={() => router.push('/auth/forgot-password')}
          />
          <Link label="Need an account? Sign up" onPress={() => router.replace('/auth/signup')} />
        </>
      }
    >
      {existing === '1' ? (
        <Text variant="body" color={ui.textMuted} style={{ marginBottom: 8 }}>
          An account already exists for this email. Log in instead.
        </Text>
      ) : null}
      <TextField
        label="Email or username"
        required
        value={identifier}
        onChangeText={(value) => {
          setIdentifier(value);
          setTouched((current) => ({ ...current, identifier: true }));
        }}
        placeholder="you@example.com or username"
        error={identifierError}
      />
      <TextField
        label="Password"
        required
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setTouched((current) => ({ ...current, password: true }));
        }}
        secureTextEntry
        error={passwordError}
      />
    </Screen>
  );
}
