import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { PostSignUpWelcomeView } from './PostSignUpWelcomeView';

const meta = {
  title: 'Features/Auth/PostSignUpWelcomeView',
  component: PostSignUpWelcomeView,
  args: {
    onCreateProfile: fn(),
    onSkip: fn(),
  },
} satisfies Meta<typeof PostSignUpWelcomeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
