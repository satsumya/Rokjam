import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import { fn } from 'storybook/test';

import { Screen } from './Screen';
import { BottomNav } from './BottomNav';
import { Button } from '../atoms/Button';
import { Text as AppText } from '../atoms/Text';

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
        <Button label="Confirm" colorStyle="style2" onPress={fn()} />
        <Button label="Cancel" variant="secondary" onPress={fn()} />
      </>
    ),
  },
};

/** Primary destinations use `bottomNav` (content max width applies to the bar too). */
export const WithBottomNav: Story = {
  args: {
    title: undefined,
    headerRight: <AppText variant="bodySmall">Account</AppText>,
    bottomNav: <BottomNav active="home" />,
    children: <Text>Home tab content — nav stays within layout.contentMaxWidth.</Text>,
  },
};
