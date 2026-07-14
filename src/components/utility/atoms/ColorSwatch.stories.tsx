import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ShadeSwatch, Swatch, WcagAaCheck } from './ColorSwatch';
import { colors } from '../../../theme/colors';
import { Padded } from '../../storybook.helpers';
import { space } from '../../../theme/spacing';

const meta = {
  title: 'Utility/Atoms/ColorSwatch',
  component: Swatch,
  decorators: [Padded],
  args: { token: 'neutral.500', value: colors.neutral[500] },
} satisfies Meta<typeof Swatch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeutralSwatch: Story = {};

export const BrandShade: Story = {
  render: () => (
    <ShadeSwatch
      token="brand.blue.main"
      background={colors.brand.blue.main}
      contrasts={[
        { label: 'contrast.alt', token: 'main.contrast.alt', color: colors.brand.blue.mainContrast.alt },
        { label: 'contrast.tonal', token: 'main.contrast.tonal', color: colors.brand.blue.mainContrast.tonal },
      ]}
    />
  ),
};

export const ContrastCheck: Story = {
  render: () => (
    <View style={{ gap: space[8] }}>
      <WcagAaCheck foreground={colors.neutral[900]} background={colors.neutral[50]} />
      <WcagAaCheck foreground={colors.neutral[400]} background={colors.neutral[50]} />
    </View>
  ),
};
