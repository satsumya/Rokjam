import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { TAKEN_EMAILS } from '../../constants/mockData';

import { SignUpView } from './SignUpView';

const meta = {
  title: 'Features/Auth/SignUpView',
  component: SignUpView,
  args: {
    email: '',
    password: '',
    onEmailChange: fn(),
    onPasswordChange: fn(),
    onSignUp: fn(),
    onLogIn: fn(),
  },
} satisfies Meta<typeof SignUpView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ValidationErrors: Story = {
  args: {
    email: '',
    password: 'short',
    emailError: 'Email is required',
    passwordError: 'Password does not meet requirements',
  },
};

export const EmailInUse: Story = {
  args: {
    email: TAKEN_EMAILS[0],
    password: 'Password1!',
    emailError: 'Email already in use',
  },
};

export const ValidPassword: Story = {
  args: {
    email: 'new.user@example.com',
    password: 'Password1!',
  },
};
