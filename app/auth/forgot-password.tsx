import { useState } from 'react';
import { router } from 'expo-router';

import { Button, Link, Screen, TextField } from '../../src/components';
import { MOCK_EXISTING_USER } from '../../src/constants/mockData';
import { getEmailError } from '../../src/utils/validation';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const emailError = touched ? getEmailError(email) : undefined;

  const handleSend = () => {
    setTouched(true);
    if (getEmailError(email)) return;
    setSent(true);
    router.push({
      pathname: '/auth/reset-password',
      params: { email: email.trim() },
    });
  };

  return (
    <Screen
      title="Forgot password"
      footer={
        <>
          <Button label="Send reset link" colorStyle="style1" onPress={handleSend} />
          <Link label="Back to log in" onPress={() => router.replace('/auth/login')} />
        </>
      }
    >
      <TextField
        label="Email"
        required
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setTouched(true);
        }}
        placeholder={MOCK_EXISTING_USER.email}
        keyboardType="email-address"
        error={emailError}
      />
      {sent ? <></> : null}
    </Screen>
  );
}
