import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text } from 'react-native';
import { fn } from 'storybook/test';

import { Modal } from './Modal';
import { Button } from '../atoms/Button';

const meta = {
  title: 'Molecules/Modal',
  component: Modal,
  args: {
    visible: true,
    title: 'Add climbing location',
    onClose: fn(),
    children: <Text>Search for your gym or crag, then set up difficulty levels.</Text>,
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return (
      <>
        <Button label="Open modal" onPress={() => setVisible(true)} />
        <Modal
          {...args}
          visible={visible}
          onClose={() => setVisible(false)}
          footer={<Button label="Save" onPress={() => setVisible(false)} />}
        />
      </>
    );
  },
};
