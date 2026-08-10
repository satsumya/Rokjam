import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

import { VerifyEmailView } from './VerifyEmailView';

const meta = {
  title: 'Features/Auth/VerifyEmailView',
  component: VerifyEmailView,
  args: {
    email: 'new.user@example.com',
    code: '',
    resent: false,
    onCodeChange: fn(),
    onVerify: fn(),
    onResend: fn(),
    onChangeEmail: fn(),
  },
} satisfies Meta<typeof VerifyEmailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CodeEntered: Story = {
  args: { code: '123456' },
};

export const InvalidCode: Story = {
  args: {
    code: '000000',
    codeError: 'Invalid code',
  },
};

export const Resent: Story = {
  args: { resent: true },
};
