import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { MOCK_EXISTING_USER } from '../../constants/mockData';

import { ForgotPasswordView } from './ForgotPasswordView';

const meta = {
  title: 'Features/Auth/ForgotPasswordView',
  component: ForgotPasswordView,
  args: {
    email: '',
    onEmailChange: fn(),
    onSend: fn(),
    onBackToLogin: fn(),
  },
} satisfies Meta<typeof ForgotPasswordView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEmail: Story = {
  args: { email: MOCK_EXISTING_USER.email },
};

export const ValidationError: Story = {
  args: {
    email: 'not-an-email',
    emailError: 'Enter a valid email address',
  },
};
