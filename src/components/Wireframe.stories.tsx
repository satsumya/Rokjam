import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text } from 'react-native';
import { fn } from 'storybook/test';

import {
  WireframeBottomSheet,
  WireframeBox,
  WireframeButton,
  WireframeField,
  WireframeHintList,
  WireframeLink,
  WireframeModal,
  WireframeSection,
} from './Wireframe';
import { Padded } from './storybook.helpers';

const meta = {
  title: 'Wireframe/Primitives',
  component: WireframeButton,
  decorators: [Padded],
  args: { label: 'Save session', onPress: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
  },
} satisfies Meta<typeof WireframeButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: { variant: 'primary' },
};

export const ButtonSecondary: Story = {
  args: { label: 'Add image', variant: 'secondary' },
};

export const ButtonGhost: Story = {
  args: { label: 'Share climb', variant: 'ghost' },
};

export const ButtonDisabled: Story = {
  args: { label: 'Save session', disabled: true },
};

export const Field: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <WireframeField
        label="Username"
        required
        value={value}
        onChangeText={setValue}
        placeholder="e.g. crimp_queen"
        hint="Shown on your public sessions"
      />
    );
  },
};

export const FieldWithError: Story = {
  render: () => (
    <WireframeField
      label="Email"
      required
      value="not-an-email"
      onChangeText={fn()}
      error="Enter a valid email address"
      keyboardType="email-address"
    />
  ),
};

export const Box: Story = {
  render: () => (
    <WireframeBox>
      <Text style={{ fontWeight: '700' }}>Session summary</Text>
      <Text>45m · 6 climbs · Yellow–Purple</Text>
    </WireframeBox>
  ),
};

export const Link: Story = {
  render: () => <WireframeLink label="Change location" onPress={fn()} />,
};

export const Section: Story = {
  render: () => (
    <WireframeSection
      title="Climbs"
      subtitle="Everything logged in this session"
      headerAction={<WireframeLink label="Add" onPress={fn()} />}
    >
      <WireframeBox>
        <Text>Comp wall dyno</Text>
      </WireframeBox>
    </WireframeSection>
  ),
};

export const HintList: Story = {
  render: () => (
    <WireframeHintList
      items={[
        { label: 'At least 8 characters', met: true },
        { label: 'One number', met: true },
        { label: 'One symbol', met: false },
      ]}
    />
  ),
};

export const Modal: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <>
        <WireframeButton label="Open modal" onPress={() => setVisible(true)} />
        <WireframeModal
          visible={visible}
          title="Edit profile"
          onClose={() => setVisible(false)}
          footer={<WireframeButton label="Done" onPress={() => setVisible(false)} />}
        >
          <Text>Modal body content goes here.</Text>
        </WireframeModal>
      </>
    );
  },
};

export const BottomSheet: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <>
        <WireframeButton label="Delete session" variant="secondary" onPress={() => setVisible(true)} />
        <WireframeBottomSheet
          visible={visible}
          title="Delete this session?"
          onClose={() => setVisible(false)}
        >
          <Text>This can't be undone.</Text>
          <WireframeButton label="Delete" onPress={() => setVisible(false)} />
          <WireframeButton label="Cancel" variant="ghost" onPress={() => setVisible(false)} />
        </WireframeBottomSheet>
      </>
    );
  },
};
