import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { WelcomeView } from './WelcomeView';

const meta = {
  title: 'Features/Welcome/WelcomeView',
  component: WelcomeView,
  args: {
    onSignUp: fn(),
    onLogIn: fn(),
    onScenarioTester: fn(),
  },
} satisfies Meta<typeof WelcomeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
