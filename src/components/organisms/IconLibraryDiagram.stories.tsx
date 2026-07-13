import type { Meta, StoryObj } from '@storybook/react-native';

import { IconLibraryDiagram } from './IconLibraryDiagram';
import { ICON_SIZE_NAMES } from '../../theme/icon';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Organisms/IconLibraryDiagram',
  component: IconLibraryDiagram,
  decorators: [Padded],
  args: { initialWeight: 'auto', initialSize: 'md' },
  argTypes: {
    initialWeight: { control: 'select', options: ['auto', 'regular', 'bold', 'fill', 'duotone'] },
    initialSize: { control: 'select', options: ICON_SIZE_NAMES },
  },
} satisfies Meta<typeof IconLibraryDiagram>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StartFill: Story = { args: { initialWeight: 'fill', initialSize: 'sm' } };
export const StartRegularXl: Story = { args: { initialWeight: 'auto', initialSize: 'xl' } };
