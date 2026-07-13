import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import { fn } from 'storybook/test';

import { Section } from './Section';
import { Link } from './Link';
import { Padded } from '../storybook.helpers';

const meta = {
  title: 'Atoms/Section',
  component: Section,
  decorators: [Padded],
  args: {
    title: 'Climbs',
    children: <Text>Section body content goes here.</Text>,
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: { subtitle: 'Sorted newest first' },
};

export const WithHeaderAction: Story = {
  args: { headerAction: <Link label="Full list" onPress={fn()} /> },
};
