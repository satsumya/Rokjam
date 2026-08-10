import { Button, HintList, Link, Screen, Text, TextField } from '../../components';
import { ui } from '../../theme/colors';

export type ResetPasswordViewProps = {
  email?: string;
  password: string;
  confirm: string;
  passwordError?: string;
  confirmError?: string;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onReset: () => void;
  onBackToLogin: () => void;
};

export function ResetPasswordView({
  email,
  password,
  confirm,
  passwordError,
  confirmError,
  onPasswordChange,
  onConfirmChange,
  onReset,
  onBackToLogin,
}: ResetPasswordViewProps) {
  return (
    <Screen
      title="Reset password"
      footer={
        <>
          <Button label="Update password" colorStyle="style1" onPress={onReset} />
          <Link label="Back to log in" onPress={onBackToLogin} />
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
        onChangeText={onPasswordChange}
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
      <TextField
        label="Confirm password"
        required
        value={confirm}
        onChangeText={onConfirmChange}
        secureTextEntry
        error={confirmError}
      />
    </Screen>
  );
}
