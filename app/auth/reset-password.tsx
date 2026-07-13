import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, HintList, Link, Screen, Text, TextField } from '../../src/components';
import { ui } from '../../src/theme/colors';
import { isPasswordValid } from '../../src/utils/validation';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const passwordInvalid = touched.password && !isPasswordValid(password);
  const confirmError =
    touched.confirm && confirm !== password ? 'Passwords must match' : undefined;

  const handleReset = () => {
    setTouched({ password: true, confirm: true });
    if (!isPasswordValid(password) || confirm !== password) return;
    router.replace('/auth/login');
  };

  return (
    <Screen
      title="Reset password"
      footer={
        <>
          <Button label="Update password" onPress={handleReset} />
          <Link label="Back to log in" onPress={() => router.replace('/auth/login')} />
        </>
      }
    >
      <Text variant="body" color={ui.textMuted}>
        Set a new password for {email || 'your account'}.
      </Text>
      <TextField
        label="New password"
        required
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setTouched((current) => ({ ...current, password: true }));
        }}
        secureTextEntry
        error={passwordInvalid ? 'Password does not meet requirements' : undefined}
      />
      <HintList
        items={[
          { label: 'At least 8 characters', met: password.length >= 8 },
          { label: 'At least one number', met: /[0-9]/.test(password) },
          { label: 'At least one symbol', met: /[^A-Za-z0-9]/.test(password) },
        ]}
      />
      <TextField
        label="Confirm password"
        required
        value={confirm}
        onChangeText={(value) => {
          setConfirm(value);
          setTouched((current) => ({ ...current, confirm: true }));
        }}
        secureTextEntry
        error={confirmError}
      />
    </Screen>
  );
}
