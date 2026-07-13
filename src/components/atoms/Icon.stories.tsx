import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';

import { Icon, ICON_NAMES } from './Icon';
import { Padded } from '../storybook.helpers';
import { ui } from '../../theme/colors';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  decorators: [Padded],
  args: { name: 'house', size: 28, color: ui.text, weight: 'regular' },
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    weight: {
      control: 'select',
      options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllIcons: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {ICON_NAMES.map((name) => (
        <View key={name} style={{ width: 92, alignItems: 'center', gap: 6 }}>
          <Icon {...args} name={name} />
          <Text style={{ fontSize: 11, color: ui.textMuted, textAlign: 'center' }}>{name}</Text>
        </View>
      ))}
    </View>
  ),
};
