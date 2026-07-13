import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import { WireframeDropdown } from './WireframeDropdown';
import { Padded } from './storybook.helpers';

const OPTIONS = [
  { value: 'boulder', label: 'Bouldering' },
  { value: 'lead', label: 'Lead' },
  { value: 'top-rope', label: 'Top rope' },
  { value: 'auto-belay', label: 'Auto belay' },
];

const meta = {
  title: 'Components/WireframeDropdown',
  component: WireframeDropdown,
  decorators: [Padded],
  args: { label: 'Session type', value: 'boulder', options: OPTIONS, onChange: () => {} },
} satisfies Meta<typeof WireframeDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('boulder');
    return <WireframeDropdown label="Session type" value={value} options={OPTIONS} onChange={setValue} />;
  },
};

export const WithCustomValue: Story = {
  render: () => {
    const [value, setValue] = useState('lead');
    const [custom, setCustom] = useState('');
    return (
      <WireframeDropdown
        label="Session type"
        value={value}
        options={OPTIONS}
        onChange={setValue}
        customValue={custom}
        onCustomChange={setCustom}
        customPlaceholder="Describe your session"
      />
    );
  },
};
