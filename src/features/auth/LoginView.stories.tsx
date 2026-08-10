import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { MOCK_EXISTING_USER } from '../../constants/mockData';

import { LoginView } from './LoginView';

const meta = {
  title: 'Features/Auth/LoginView',
  component: LoginView,
  args: {
    identifier: '',
    password: '',
    onIdentifierChange: fn(),
    onPasswordChange: fn(),
    onLogin: fn(),
    onForgotPassword: fn(),
    onSignUp: fn(),
  },
} satisfies Meta<typeof LoginView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Prefilled: Story = {
  args: {
    identifier: MOCK_EXISTING_USER.email,
    password: MOCK_EXISTING_USER.password,
  },
};

export const ValidationErrors: Story = {
  args: {
    identifier: '',
    password: '',
    identifierError: 'Email or username is required',
    passwordError: 'Password is required',
  },
};

export const IncorrectPassword: Story = {
  args: {
    identifier: MOCK_EXISTING_USER.email,
    password: 'wrong-password',
    passwordError: 'Incorrect password',
  },
};
