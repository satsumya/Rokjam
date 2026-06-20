import { useState } from 'react';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  WireframeButton,
  WireframeField,
  WireframeHintList,
  WireframeLink,
  WireframeScreen,
} from '../../src/components/Wireframe';
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
    <WireframeScreen
      title="Reset password"
      footer={
        <>
          <WireframeButton label="Update password" onPress={handleReset} />
          <WireframeLink label="Back to log in" onPress={() => router.replace('/auth/login')} />
        </>
      }
    >
      <Text style={{ color: '#666' }}>Set a new password for {email || 'your account'}.</Text>
      <WireframeField
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
      <WireframeHintList
        items={[
          { label: 'At least 8 characters', met: password.length >= 8 },
          { label: 'At least one number', met: /[0-9]/.test(password) },
          { label: 'At least one symbol', met: /[^A-Za-z0-9]/.test(password) },
        ]}
      />
      <WireframeField
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
    </WireframeScreen>
  );
}
