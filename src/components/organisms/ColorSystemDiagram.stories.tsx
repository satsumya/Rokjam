import type { Meta, StoryObj } from '@storybook/react-native';

import { ColorSystemDiagram } from './ColorSystemDiagram';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Organisms/ColorSystemDiagram',
  component: ColorSystemDiagram,
  decorators: [Padded],
  args: { filter: 'all' },
  argTypes: {
    filter: { control: 'select', options: ['all', 'brand', 'neutral', 'semantic'] },
  },
} satisfies Meta<typeof ColorSystemDiagram>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = { args: { filter: 'all' } };
export const Brand: Story = { args: { filter: 'brand' } };
export const Neutral: Story = { args: { filter: 'neutral' } };
export const Semantic: Story = { args: { filter: 'semantic' } };
