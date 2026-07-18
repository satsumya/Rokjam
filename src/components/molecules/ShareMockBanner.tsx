import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';

export function ShareMockBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <Text variant="body" weight="bold" color={ui.textMuted}>
      Share link copied (prototype mock)
    </Text>
  );
}
