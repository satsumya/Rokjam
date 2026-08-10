import { Button, Link, Screen, TextField } from '../../components';

export type LoginViewProps = {
  identifier: string;
  password: string;
  identifierError?: string;
  passwordError?: string;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
};

export function LoginView({
  identifier,
  password,
  identifierError,
  passwordError,
  onIdentifierChange,
  onPasswordChange,
  onLogin,
  onForgotPassword,
  onSignUp,
}: LoginViewProps) {
  return (
    <Screen
      title="Log in"
      footer={
        <>
          <Button label="Log in" colorStyle="style1" onPress={onLogin} />
          <Link label="Forgot password?" onPress={onForgotPassword} />
          <Link label="Need an account? Sign up" onPress={onSignUp} />
        </>
      }
    >
      <TextField
        label="Email or username"
        required
        value={identifier}
        onChangeText={onIdentifierChange}
        placeholder="you@example.com or username"
        error={identifierError}
      />
      <TextField
        label="Password"
        required
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        error={passwordError}
      />
    </Screen>
  );
}
