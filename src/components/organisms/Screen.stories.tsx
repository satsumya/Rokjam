import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import { fn } from 'storybook/test';

import { Screen } from './Screen';
import { Button } from '../atoms/Button';

const meta = {
  title: 'Organisms/Screen',
  component: Screen,
  args: {
    title: 'Dashboard',
    children: <Text>Screen body content sits here inside the scroll area.</Text>,
  },
} satisfies Meta<typeof Screen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wide: Story = {
  args: {
    wide: true,
    title: 'Colour system',
    children: <Text>Utility screens use wide layout with no max width.</Text>,
  },
};

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button label="Start climbing session" onPress={fn()} />
        <Button label="Community" variant="secondary" onPress={fn()} />
      </>
    ),
  },
};
