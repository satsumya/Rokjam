import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

import { PrototypeOnly } from './PrototypeOnly';
import { WireframeBox } from './Wireframe';
import { Padded } from './storybook.helpers';

const meta = {
  title: 'Components/PrototypeOnly',
  component: PrototypeOnly,
  decorators: [Padded],
  args: { children: null },
} satisfies Meta<typeof PrototypeOnly>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RendersChildren: Story = {
  render: () => (
    <PrototypeOnly>
      <WireframeBox>
        <Text>Prototype-only tooling — hidden during flow-map capture.</Text>
      </WireframeBox>
    </PrototypeOnly>
  ),
};
