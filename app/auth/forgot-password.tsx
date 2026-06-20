import { useState } from 'react';
import { router } from 'expo-router';

import {
  WireframeButton,
  WireframeField,
  WireframeLink,
  WireframeScreen,
} from '../../src/components/Wireframe';
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
    <WireframeScreen
      title="Forgot password"
      footer={
        <>
          <WireframeButton label="Send reset link" onPress={handleSend} />
          <WireframeLink label="Back to log in" onPress={() => router.replace('/auth/login')} />
        </>
      }
    >
      <WireframeField
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
    </WireframeScreen>
  );
}
