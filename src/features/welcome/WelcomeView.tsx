import { Button, PrototypeOnly, Screen } from '../../components';

export type WelcomeViewProps = {
  onSignUp: () => void;
  onLogIn: () => void;
  onScenarioTester: () => void;
};

export function WelcomeView({ onSignUp, onLogIn, onScenarioTester }: WelcomeViewProps) {
  return (
    <Screen
      title="Welcome"
      footer={
        <>
          <Button label="Sign up" colorStyle="style2" onPress={onSignUp} />
          <Button label="Log in" colorStyle="style1" onPress={onLogIn} />
          <PrototypeOnly>
            <Button label="Scenario tester" variant="ghost" onPress={onScenarioTester} />
          </PrototypeOnly>
        </>
      }
    >
      <></>
    </Screen>
  );
}
