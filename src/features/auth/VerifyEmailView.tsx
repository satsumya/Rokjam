import { Button, Link, Screen, Text, TextField } from '../../components';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export type VerifyEmailViewProps = {
  email: string;
  code: string;
  codeError?: string;
  resent: boolean;
  onCodeChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onChangeEmail: () => void;
};

export function VerifyEmailView({
  email,
  code,
  codeError,
  resent,
  onCodeChange,
  onVerify,
  onResend,
  onChangeEmail,
}: VerifyEmailViewProps) {
  return (
    <Screen
      title="Verify email"
      footer={
        <>
          <Button label="Verify" colorStyle="style2" onPress={onVerify} />
          <Link label="Resend code" onPress={onResend} />
          <Link label="Change email" onPress={onChangeEmail} />
        </>
      }
    >
      <Text variant="body" color={ui.textMuted} style={{ marginBottom: space[8] }}>
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
        onChangeText={onCodeChange}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        error={codeError}
      />
    </Screen>
  );
}
