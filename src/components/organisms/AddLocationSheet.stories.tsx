import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { AddLocationSheet } from './AddLocationSheet';
import { Button } from '../atoms/Button';
import { WithPrototype } from '../storybook.helpers';

import type { DifficultyLevel } from '../../domain/types/profile';

const mockAddLocation = (_name: string, _nickname: string | undefined, levels: DifficultyLevel[]) =>
  `story-loc-${levels.length}`;

const meta = {
  title: 'Organisms/AddLocationSheet',
  component: AddLocationSheet,
  decorators: [WithPrototype],
  args: {
    visible: true,
    onClose: fn(),
    onSaved: fn(),
    onAddLocationWithLevels: mockAddLocation,
  },
} satisfies Meta<typeof AddLocationSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return (
      <>
        <Button label="Add location" onPress={() => setVisible(true)} />
        <AddLocationSheet {...args} visible={visible} onClose={() => setVisible(false)} />
      </>
    );
  },
};
