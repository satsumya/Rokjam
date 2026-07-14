import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { colors, ui } from '../../../theme/colors';
import { interactionStyle } from '../../../theme/interaction';
import {
  FONT_BASE,
  FONT_RATIO,
  TEXT_VARIANT_NAMES,
  textStyle,
  type FontWeightName,
  type TextVariant,
} from '../../../theme/typography';
import { Section } from '../../atoms/Section';
import { Text } from '../../atoms/Text';

const isHeading = (variant: TextVariant) => /^h[1-6]$/.test(variant);

const HEADING_VARIANTS = TEXT_VARIANT_NAMES.filter(isHeading);
const BODY_VARIANTS = TEXT_VARIANT_NAMES.filter((variant) => !isHeading(variant));

const familyLabel = (variant: TextVariant) => (isHeading(variant) ? 'Fira Sans' : 'Saira');

/** Refaat Alareer — "If I Must Die". Used as the reading specimen. */
const POEM =
  'If I must die, you must live to tell my story to sell my things to buy a piece ' +
  'of cloth and some strings, (make it white with a long tail) so that a child, ' +
  'somewhere in Gaza while looking heaven in the eye awaiting his dad who left in a ' +
  'blaze—and bid no one farewell not even to his flesh not even to himself—sees the ' +
  'kite, my kite you made, flying up above and thinks for a moment an angel is there ' +
  'bringing back love If I must die let it bring hope let it be a tale.';

const SHORT_LINE = 'If I must die, let it bring hope, let it be a tale.';

type Specimen = 'short' | 'poem';

function SelectChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        {
          borderWidth: 1,
          borderColor: active ? colors.neutral[900] : colors.neutral[300],
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: active ? colors.neutral[100] : colors.neutral[50],
        },
        interactionStyle(state),
      ]}
    >
      <Text variant="bodySmall" weight={active ? 'bold' : 'regular'} color={colors.neutral[900]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SpecimenRow({
  variant,
  weight,
  text,
}: {
  variant: TextVariant;
  weight: FontWeightName;
  text: string;
}) {
  const style = textStyle(variant, weight);
  return (
    <View style={{ gap: 6, paddingVertical: 14, borderTopWidth: 1, borderTopColor: ui.borderSubtle }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <Text variant="bodySmall" weight="bold">
          {variant}
        </Text>
        <Text variant="bodySmall" color={ui.textMuted}>
          {style.fontSize} / {style.lineHeight} px · {familyLabel(variant)}
        </Text>
      </View>
      <Text variant={variant} weight={weight}>
        {text}
      </Text>
    </View>
  );
}

export function TypographyDiagram({
  initialWeight = 'regular',
  initialSpecimen = 'short',
}: {
  initialWeight?: FontWeightName;
  initialSpecimen?: Specimen;
}) {
  const [weight, setWeight] = useState<FontWeightName>(initialWeight);
  const [specimen, setSpecimen] = useState<Specimen>(initialSpecimen);
  const [custom, setCustom] = useState('');

  const specimenText = specimen === 'poem' ? POEM : SHORT_LINE;
  const text = custom.trim().length > 0 ? custom : specimenText;

  return (
    <>
      <Section title="Controls">
        <View style={{ gap: 6 }}>
          <Text variant="bodySmall" weight="bold" color={ui.textMuted}>
            Weight
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <SelectChip label="Regular" active={weight === 'regular'} onPress={() => setWeight('regular')} />
            <SelectChip label="Bold" active={weight === 'bold'} onPress={() => setWeight('bold')} />
          </View>
        </View>

        <View style={{ gap: 6, marginTop: 14 }}>
          <Text variant="bodySmall" weight="bold" color={ui.textMuted}>
            Specimen
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <SelectChip label="Short line" active={specimen === 'short'} onPress={() => setSpecimen('short')} />
            <SelectChip label="Full poem" active={specimen === 'poem'} onPress={() => setSpecimen('poem')} />
          </View>
        </View>

        <View style={{ gap: 6, marginTop: 14 }}>
          <Text variant="bodySmall" weight="bold" color={ui.textMuted}>
            Custom text (overrides specimen)
          </Text>
          <TextInput
            value={custom}
            onChangeText={setCustom}
            placeholder="Type to preview your own text…"
            placeholderTextColor={ui.textMuted}
            multiline
            style={{
              minHeight: 44,
              borderWidth: 1,
              borderColor: ui.border,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: ui.text,
              ...textStyle('body'),
            }}
          />
        </View>
      </Section>

      <Section title="Headings — Fira Sans">
        <Text variant="bodySmall" color={ui.textMuted} style={{ marginBottom: 4 }}>
          Six sizes from the modular scale (base {FONT_BASE}px · ratio {FONT_RATIO}, perfect fourth). Headings
          default to bold.
        </Text>
        {HEADING_VARIANTS.map((variant) => (
          <SpecimenRow key={variant} variant={variant} weight={weight} text={text} />
        ))}
      </Section>

      <Section title="Body — Saira">
        <Text variant="bodySmall" color={ui.textMuted} style={{ marginBottom: 4 }}>
          Three sizes: one step above the base, the 16px base, and one below. Body defaults to regular.
        </Text>
        {BODY_VARIANTS.map((variant) => (
          <SpecimenRow key={variant} variant={variant} weight={weight} text={text} />
        ))}
      </Section>
    </>
  );
}
