import { useEffect, useState } from 'react';

import { useAuth } from '../../data/hooks/useAuth';
import { getVerificationCodeError } from '../../utils/validation';

import type { VerifyEmailViewProps } from './VerifyEmailView';

export type UseVerifyEmailOptions = {
  demo?: string;
  onSuccess: () => void;
  onChangeEmail: () => void;
};

export function useVerifyEmail({
  demo,
  onSuccess,
  onChangeEmail,
}: UseVerifyEmailOptions): VerifyEmailViewProps {
  const { email, setEmail } = useAuth();
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
    onSuccess();
  };

  return {
    email,
    code,
    codeError,
    resent,
    onCodeChange: (value) => {
      setCode(value.replace(/\D/g, '').slice(0, 6));
      setTouched(true);
    },
    onVerify: handleVerify,
    onResend: () => setResent(true),
    onChangeEmail,
  };
}
