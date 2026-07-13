import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors, ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { ICON_SIZE_NAMES, iconSizes, type IconSize } from '../../theme/icon';
import {
  Icon,
  ICON_NAMES,
  ICON_WEIGHTS,
  DEFAULT_WEIGHT_FOR_SIZE,
  type IconName,
  type IconWeight,
} from '../atoms/Icon';
import { Section } from '../atoms/Section';

/** Size tokens that default to a given weight (derived from the size→weight map). */
function sizesForWeight(weight: IconWeight) {
  return ICON_SIZE_NAMES.filter((s) => DEFAULT_WEIGHT_FOR_SIZE[s] === weight);
}

/** A few glyphs with enough interior detail to show weight differences well. */
const WEIGHT_SAMPLES: IconName[] = ['house', 'checkCircle', 'sparkle', 'video', 'close'];

/** `auto` lets each icon follow its size (see DEFAULT_WEIGHT_FOR_SIZE). */
const WEIGHT_OPTIONS = ['auto', ...ICON_WEIGHTS] as const;
type WeightOption = (typeof WEIGHT_OPTIONS)[number];

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
      <Text style={{ fontWeight: active ? '700' : '400', fontSize: 14, color: colors.neutral[900] }}>
        {label}
      </Text>
    </Pressable>
  );
}

function Badge({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: muted ? 'transparent' : ui.surfaceMuted,
        borderWidth: 1,
        borderColor: muted ? ui.borderSubtle : ui.border,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '600', color: muted ? ui.textSubtle : ui.text }}>
        {label}
      </Text>
    </View>
  );
}

export function IconLibraryDiagram({
  initialWeight = 'auto',
  initialSize = 'md',
}: {
  /** Starting gallery weight; `auto` lets each icon follow its size. */
  initialWeight?: WeightOption;
  initialSize?: IconSize;
}) {
  const [weightOption, setWeightOption] = useState<WeightOption>(initialWeight);
  const [size, setSize] = useState<IconSize>(initialSize);
  const galleryWeight = weightOption === 'auto' ? undefined : weightOption;

  return (
    <>
      <Section title="Weights">
        <Text style={{ color: ui.textMuted, lineHeight: 20, marginBottom: 12 }}>
          We use four Phosphor weights (thin and light are disabled). Weight follows size automatically:{' '}
          <Text style={{ fontWeight: '700', color: ui.text }}>xs/sm → fill</Text>,{' '}
          <Text style={{ fontWeight: '700', color: ui.text }}>md/lg/xl → bold</Text>. `regular` and `duotone`
          aren't mapped to a size (manual use only); `regular` is used for outline states like an unchecked
          checkbox or unmet hint.
        </Text>
        <View style={{ gap: 14 }}>
          {ICON_WEIGHTS.map((w) => {
            const sizes = sizesForWeight(w);
            const isDefault = sizes.length > 0;
            return (
              <View key={w} style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: ui.text, minWidth: 72 }}>{w}</Text>
                  <Badge
                    label={isDefault ? `Default for ${sizes.join(', ')}` : 'Manual only'}
                    muted={!isDefault}
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}>
                  {WEIGHT_SAMPLES.map((name) => (
                    <Icon key={name} name={name} weight={w} size="lg" color={ui.text} />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </Section>

      <Section title="Sizes">
        <Text style={{ color: ui.textMuted, lineHeight: 20, marginBottom: 12 }}>
          Size tokens from `src/theme/icon.ts`, each shown at its automatic weight. Pass the token name to the
          Icon `size` prop instead of a raw pixel number.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
          {ICON_SIZE_NAMES.map((token) => (
            <View key={token} style={{ alignItems: 'center', gap: 6 }}>
              <Icon name="house" size={token} color={ui.text} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: ui.text }}>{token}</Text>
              <Text style={{ fontSize: 11, color: ui.textMuted }}>
                {iconSizes[token]}px · {DEFAULT_WEIGHT_FOR_SIZE[token]}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title={`All icons (${ICON_NAMES.length})`}>
        <Text style={{ color: ui.textMuted, lineHeight: 20, marginBottom: 12 }}>
          Every icon in the registry, previewed at the size and weight you pick below. Reference icons by name
          via the Icon atom.
        </Text>

        <View style={{ gap: 6, marginBottom: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: ui.text }}>Preview weight</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {WEIGHT_OPTIONS.map((w) => (
              <SelectChip
                key={w}
                label={w}
                active={weightOption === w}
                onPress={() => setWeightOption(w)}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 6, marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: ui.text }}>Preview size</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ICON_SIZE_NAMES.map((s) => (
              <SelectChip key={s} label={s} active={size === s} onPress={() => setSize(s)} />
            ))}
          </View>
        </View>

        <Text style={{ color: ui.textSubtle, fontSize: 12, marginBottom: 12 }}>
          Showing size {size} ({iconSizes[size]}px), weight{' '}
          {galleryWeight ?? `${DEFAULT_WEIGHT_FOR_SIZE[size]} (auto)`}.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {ICON_NAMES.map((name) => (
            <View
              key={name}
              style={{
                width: 96,
                alignItems: 'center',
                gap: 8,
                paddingVertical: 14,
                paddingHorizontal: 6,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: ui.borderSubtle,
                backgroundColor: ui.surface,
              }}
            >
              <Icon name={name} weight={galleryWeight} size={size} color={ui.text} />
              <Text style={{ fontSize: 11, color: ui.textMuted, textAlign: 'center' }}>{name}</Text>
            </View>
          ))}
        </View>
      </Section>
    </>
  );
}
