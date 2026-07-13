import { Text } from 'react-native';

import { Card } from '../atoms/Card';

export function ShareMockBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <Card>
      <Text style={{ fontWeight: '700' }}>Share link copied (prototype mock)</Text>
    </Card>
  );
}
