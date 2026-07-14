import type { Meta, StoryObj } from '@storybook/react-native';

import { PaletteRow } from './PaletteRow';
import { Swatch } from '../atoms/ColorSwatch';
import { colors, NEUTRAL_SHADES } from '../../../theme/colors';
import { Padded } from '../../storybook.helpers';

const meta = {
  title: 'Utility/Molecules/PaletteRow',
  component: PaletteRow,
  decorators: [Padded],
  args: {
    title: 'Neutral (sandy)',
    description: '50–100 for backgrounds; 800–900 for text.',
    children: NEUTRAL_SHADES.map((shade) => (
      <Swatch key={shade} token={`neutral.${shade}`} value={colors.neutral[shade]} />
    )),
  },
} satisfies Meta<typeof PaletteRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
