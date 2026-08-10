import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { MOCK_EXISTING_USER } from '../../constants/mockData';

import { ResetPasswordView } from './ResetPasswordView';

const meta = {
  title: 'Features/Auth/ResetPasswordView',
  component: ResetPasswordView,
  args: {
    email: MOCK_EXISTING_USER.email,
    password: '',
    confirm: '',
    onPasswordChange: fn(),
    onConfirmChange: fn(),
    onReset: fn(),
    onBackToLogin: fn(),
  },
} satisfies Meta<typeof ResetPasswordView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PasswordMismatch: Story = {
  args: {
    password: 'Password1!',
    confirm: 'Password2!',
    confirmError: 'Passwords must match',
  },
};

export const ValidEntry: Story = {
  args: {
    password: 'Password1!',
    confirm: 'Password1!',
  },
};
