import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';

import { BottomSheet } from './BottomSheet';
import { Button } from '../atoms/Button';

const meta = {
  title: 'Molecules/BottomSheet',
  component: BottomSheet,
  args: {
    visible: true,
    title: 'Delete session?',
    onClose: fn(),
    children: <Text>This will permanently remove this session and all climbs in it.</Text>,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return (
      <View style={{ flex: 1, minHeight: 400 }}>
        <Button label="Open sheet" onPress={() => setVisible(true)} />
        <BottomSheet {...args} visible={visible} onClose={() => setVisible(false)}>
          <Text>This will permanently remove this session and all climbs in it.</Text>
          <Button label="Delete session" onPress={() => setVisible(false)} />
          <Button label="Cancel" variant="ghost" onPress={() => setVisible(false)} />
        </BottomSheet>
      </View>
    );
  },
};
