import { Button, Screen, Text } from '../../components';
import { ui } from '../../theme/colors';

export type PostSignUpWelcomeViewProps = {
  onCreateProfile: () => void;
  onSkip: () => void;
};

export function PostSignUpWelcomeView({ onCreateProfile, onSkip }: PostSignUpWelcomeViewProps) {
  return (
    <Screen
      title="Welcome"
      headerRight={
        <Button
          icon="close"
          variant="ghost"
          size="small"
          accessibilityLabel="Skip"
          onPress={onSkip}
        />
      }
      footer={
        <>
          <Button label="Create member profile" colorStyle="style1" onPress={onCreateProfile} />
          <Button label="Skip for now" variant="ghost" onPress={onSkip} />
        </>
      }
    >
      <Text variant="body" color={ui.textMuted}>
        Your account is ready. Set up your member profile to personalise your climbing experience.
      </Text>
    </Screen>
  );
}
