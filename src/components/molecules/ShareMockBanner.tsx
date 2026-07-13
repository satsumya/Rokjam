import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

export function ShareMockBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <Card>
      <Text variant="body" weight="bold">
        Share link copied (prototype mock)
      </Text>
    </Card>
  );
}
