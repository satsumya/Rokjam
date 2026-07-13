import type { Meta, StoryObj } from '@storybook/react-native';

import { TypographyDiagram } from './TypographyDiagram';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Organisms/TypographyDiagram',
  component: TypographyDiagram,
  decorators: [Padded],
  args: { initialWeight: 'regular', initialSpecimen: 'short' },
  argTypes: {
    initialWeight: { control: 'select', options: ['regular', 'bold'] },
    initialSpecimen: { control: 'select', options: ['short', 'poem'] },
  },
} satisfies Meta<typeof TypographyDiagram>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bold: Story = { args: { initialWeight: 'bold' } };
export const Poem: Story = { args: { initialSpecimen: 'poem' } };
