import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { FlowMapActionButton } from './FlowMapActionButton';
import { Padded, StatesGallery, previewStateArgType } from '../../storybook.helpers';

const meta = {
  title: 'Utility/Atoms/FlowMapActionButton',
  component: FlowMapActionButton,
  decorators: [Padded],
  args: { label: 'Download', onPress: fn(), accessibilityLabel: 'Download screenshot' },
  argTypes: {
    variant: { control: 'select', options: ['download', 'update'] },
    previewState: previewStateArgType,
  },
} satisfies Meta<typeof FlowMapActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Download: Story = { args: { variant: 'download' } };
export const Update: Story = { args: { label: 'Update', variant: 'update', accessibilityLabel: 'Update screenshot' } };
export const Disabled: Story = { args: { label: 'Updating…', variant: 'update', disabled: true, accessibilityLabel: 'Updating' } };

export const States: Story = {
  render: (args) => (
    <StatesGallery>
      {(state) => <FlowMapActionButton {...args} previewState={state} />}
    </StatesGallery>
  ),
};
