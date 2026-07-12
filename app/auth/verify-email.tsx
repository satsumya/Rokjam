import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  WireframeButton,
  WireframeField,
  WireframeLink,
  WireframeScreen,
} from '../../src/components/Wireframe';
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
    <WireframeScreen
      title="Verify email"
      footer={
        <>
          <WireframeButton label="Verify" onPress={handleVerify} />
          <WireframeLink label="Resend code" onPress={() => setResent(true)} />
          <WireframeLink
            label="Change email"
            onPress={() => router.replace('/auth/signup')}
          />
        </>
      }
    >
      <Text style={{ color: ui.textMuted, marginBottom: 8 }}>
        Enter the 6-digit code sent to {email || 'your email'}.
      </Text>
      {resent ? <Text style={{ color: ui.success }}>A new code has been sent.</Text> : null}
      <WireframeField
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
    </WireframeScreen>
  );
}
