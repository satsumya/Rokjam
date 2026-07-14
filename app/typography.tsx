import { router } from 'expo-router';

import { Button, Screen, Section, Text } from '../src/components';
import { TypographyDiagram } from '../src/components/utility';
import { ui } from '../src/theme/colors';
import { scenarioWebLink } from '../src/constants/scenarios';

export default function TypographyPage() {
  return (
    <Screen
      title="Typography"
      footer={
        <>
          <Button label="Colour system" variant="secondary" onPress={() => router.push('/color-system')} />
          <Button label="Icon library" variant="ghost" onPress={() => router.push('/icon-library')} />
          <Button label="Back to welcome" variant="ghost" onPress={() => router.replace('/')} />
        </>
      }
    >
      <Section title="How to use">
        <Text variant="body" color={ui.textMuted}>
          Live reference for the type scale in `src/theme/typography.ts`. One modular scale — 16px base, 1.333
          ratio (perfect fourth) — split into six heading sizes (Fira Sans) and three body sizes (Saira), each
          with regular and bold weights. Consume styles through the `Text` atom (`variant` + optional `weight`),
          never a raw `fontSize`. Use the controls to switch weight and preview real copy.
        </Text>
        <Text variant="bodySmall" color={ui.textSubtle} style={{ marginTop: 8 }}>
          {scenarioWebLink('/typography')}
        </Text>
      </Section>

      <TypographyDiagram />
    </Screen>
  );
}
