import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, HintList, Link, Screen, TextField } from '../../src/components';
import { MOCK_EXISTING_USER } from '../../src/constants/mockData';
import { usePrototype } from '../../src/context/PrototypeContext';
import { getEmailError, isPasswordValid } from '../../src/utils/validation';

export default function SignUpScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const { email, setEmail } = usePrototype();
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const clearedOnMount = useRef(false);

  useEffect(() => {
    if (demo === 'error-empty') {
      setTouched({ email: true, password: true });
      return;
    }
    if (clearedOnMount.current) return;
    setEmail('');
    setPassword('');
    setTouched({ email: false, password: false });
    clearedOnMount.current = true;
  }, [demo, setEmail]);

  const emailError = touched.email ? getEmailError(email) : undefined;
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
    const nextEmailError = getEmailError(email);
    if (nextEmailError || !isPasswordValid(password)) return;

    if (email.trim().toLowerCase() === MOCK_EXISTING_USER.email) {
      router.replace('/auth/login?existing=1');
      return;
    }

    router.push('/auth/verify-email');
  };

  return (
    <Screen
      title="Sign up"
      footer={
        <>
          <Button label="Create account" colorStyle="style2" onPress={handleSignUp} />
          <Link label="Already have an account? Log in" onPress={() => router.replace('/auth/login')} />
        </>
      }
    >
      <TextField
        label="Email"
        required
        value={email}
        onChangeText={handleEmailChange}
        placeholder="you@example.com"
        keyboardType="email-address"
        error={emailError}
      />
      <TextField
        label="Password"
        required
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
        error={passwordError}
      />
      <HintList
        items={[
          { label: 'At least 8 characters', met: password.length >= 8 },
          { label: 'At least one number', met: /[0-9]/.test(password) },
          { label: 'At least one symbol', met: /[^A-Za-z0-9]/.test(password) },
        ]}
      />
    </Screen>
  );
}
