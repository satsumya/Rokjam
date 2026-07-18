import { useEffect, useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, Link, Screen, TextField } from '../../src/components';
import { MOCK_EXISTING_USER } from '../../src/constants/mockData';
import { usePrototype } from '../../src/context/PrototypeContext';
import { getLoginIdentifierError } from '../../src/utils/validation';

export default function LoginScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const { email, setEmail, seedReturningUser } = usePrototype();
  const [identifier, setIdentifier] = useState(email);
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ identifier: false, password: false });
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
    // Carry email typed on sign up (shared via prototype context).
    if (email.trim()) {
      setIdentifier(email);
    }
    initialized.current = true;
  }, [demo, email, setEmail]);

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

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    setEmail(value);
    setTouched((current) => ({ ...current, identifier: true }));
  };

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
          <Button label="Log in" colorStyle="style1" onPress={handleLogin} />
          <Link
            label="Forgot password?"
            onPress={() => router.push('/auth/forgot-password')}
          />
          <Link label="Need an account? Sign up" onPress={() => router.replace('/auth/signup')} />
        </>
      }
    >
      <TextField
        label="Email or username"
        required
        value={identifier}
        onChangeText={handleIdentifierChange}
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
