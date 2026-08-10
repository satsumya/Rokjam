import { Button, HintList, Link, Screen, TextField } from '../../components';

export type SignUpViewProps = {
  email: string;
  password: string;
  emailError?: string;
  passwordError?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSignUp: () => void;
  onLogIn: () => void;
};

export function SignUpView({
  email,
  password,
  emailError,
  passwordError,
  onEmailChange,
  onPasswordChange,
  onSignUp,
  onLogIn,
}: SignUpViewProps) {
  return (
    <Screen
      title="Sign up"
      footer={
        <>
          <Button label="Create account" colorStyle="style2" onPress={onSignUp} />
          <Link label="Already have an account? Log in" onPress={onLogIn} />
        </>
      }
    >
      <TextField
        label="Email"
        required
        value={email}
        onChangeText={onEmailChange}
        placeholder="you@example.com"
        keyboardType="email-address"
        error={emailError}
      />
      <TextField
        label="Password"
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
    </Screen>
  );
}
