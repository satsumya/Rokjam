import { Button, Link, Screen, TextField } from '../../components';
import { MOCK_EXISTING_USER } from '../../constants/mockData';

export type ForgotPasswordViewProps = {
  email: string;
  emailError?: string;
  onEmailChange: (value: string) => void;
  onSend: () => void;
  onBackToLogin: () => void;
};

export function ForgotPasswordView({
  email,
  emailError,
  onEmailChange,
  onSend,
  onBackToLogin,
}: ForgotPasswordViewProps) {
  return (
    <Screen
      title="Forgot password"
      footer={
        <>
          <Button label="Send reset link" colorStyle="style1" onPress={onSend} />
          <Link label="Back to log in" onPress={onBackToLogin} />
        </>
      }
    >
      <TextField
        label="Email"
        required
        value={email}
        onChangeText={onEmailChange}
        placeholder={MOCK_EXISTING_USER.email}
        keyboardType="email-address"
        error={emailError}
      />
    </Screen>
  );
}
