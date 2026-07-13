import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { AddLocationSheet } from './AddLocationSheet';
import { WireframeButton } from './Wireframe';
import { Padded, WithPrototype } from './storybook.helpers';

const meta = {
  title: 'Components/AddLocationSheet',
  component: AddLocationSheet,
  decorators: [WithPrototype, Padded],
  args: { visible: false, onClose: () => {}, onSaved: fn() },
} satisfies Meta<typeof AddLocationSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <>
        <WireframeButton label="Add climbing location" onPress={() => setVisible(true)} />
        <AddLocationSheet
          visible={visible}
          onClose={() => setVisible(false)}
          onSaved={fn()}
        />
      </>
    );
  },
};

export const OpenByDefault: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <AddLocationSheet
        visible={visible}
        onClose={() => setVisible(false)}
        onSaved={fn()}
      />
    );
  },
};
