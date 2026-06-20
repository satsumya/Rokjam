import { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  WireframeButton,
  WireframeField,
  WireframeLink,
  WireframeScreen,
} from '../../src/components/Wireframe';
import { MOCK_EXISTING_USER } from '../../src/constants/mockData';
import { usePrototype } from '../../src/context/PrototypeContext';
import { getLoginIdentifierError } from '../../src/utils/validation';

export default function LoginScreen() {
  const { demo, existing } = useLocalSearchParams<{ demo?: string; existing?: string }>();
  const { setEmail } = usePrototype();
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
      setEmail(MOCK_EXISTING_USER.email);
    }

    router.replace('/dashboard');
  };

  return (
    <WireframeScreen
      title="Log in"
      footer={
        <>
          <WireframeButton label="Log in" onPress={handleLogin} />
          <WireframeLink
            label="Forgot password?"
            onPress={() => router.push('/auth/forgot-password')}
          />
          <WireframeLink label="Need an account? Sign up" onPress={() => router.replace('/auth/signup')} />
        </>
      }
    >
      {existing === '1' ? (
        <Text style={{ color: '#666', marginBottom: 8 }}>
          An account already exists for this email. Log in instead.
        </Text>
      ) : null}
      <WireframeField
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
      <WireframeField
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
    </WireframeScreen>
  );
}
