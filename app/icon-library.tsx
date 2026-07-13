import { Text } from 'react-native';
import { router } from 'expo-router';

import { Button, IconLibraryDiagram, Screen, Section } from '../src/components';
import { colors } from '../src/theme/colors';
import { scenarioWebLink } from '../src/constants/scenarios';

export default function IconLibraryPage() {
  return (
    <Screen
      title="Icon library"
      footer={
        <>
          <Button label="Colour system" variant="secondary" onPress={() => router.push('/color-system')} />
          <Button label="Typography" variant="ghost" onPress={() => router.push('/typography')} />
          <Button label="Flow map" variant="ghost" onPress={() => router.push('/flow-map')} />
          <Button label="Back to welcome" variant="ghost" onPress={() => router.replace('/')} />
        </>
      }
    >
      <Section title="How to use">
        <Text style={{ color: colors.neutral[600], lineHeight: 22 }}>
          Live reference for every icon in the app, backed by Phosphor (phosphoricons.com). Icons come from the
          `Icon` atom — reference them by name (`src/components/atoms/Icon.tsx`), size them with the scale tokens
          (`src/theme/icon.ts`), and weight follows size automatically. Use the controls in the All icons
          section to preview the whole set at any size and weight.
        </Text>
        <Text style={{ color: colors.neutral[500], fontSize: 13, marginTop: 8 }}>{scenarioWebLink('/icon-library')}</Text>
      </Section>

      <IconLibraryDiagram />
    </Screen>
  );
}
