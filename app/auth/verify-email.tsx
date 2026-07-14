import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import { Button, Link, Screen, Text, TextField } from '../../src/components';
import { usePrototype } from '../../src/context/PrototypeContext';
import { ui } from '../../src/theme/colors';
import { getVerificationCodeError } from '../../src/utils/validation';

export default function VerifyEmailScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const { email, setEmail } = usePrototype();
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (demo === 'prefill' && !email) {
      setEmail('new.user@example.com');
    }
  }, [demo, email, setEmail]);

  const codeError = touched ? getVerificationCodeError(code) : undefined;

  const handleVerify = () => {
    setTouched(true);
    if (getVerificationCodeError(code)) return;
    router.push('/welcome-signup');
  };

  return (
    <Screen
      title="Verify email"
      footer={
        <>
          <Button label="Verify" colorStyle="style2" onPress={handleVerify} />
          <Link label="Resend code" onPress={() => setResent(true)} />
          <Link
            label="Change email"
            onPress={() => router.replace('/auth/signup')}
          />
        </>
      }
    >
      <Text variant="body" color={ui.textMuted} style={{ marginBottom: 8 }}>
        Enter the 6-digit code sent to {email || 'your email'}.
      </Text>
      {resent ? (
        <Text variant="body" color={ui.success}>
          A new code has been sent.
        </Text>
      ) : null}
      <TextField
        label="Verification code"
        required
        value={code}
        onChangeText={(value) => {
          setCode(value.replace(/\D/g, '').slice(0, 6));
          setTouched(true);
        }}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        error={codeError}
      />
    </Screen>
  );
}
