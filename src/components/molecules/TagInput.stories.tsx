import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { TagInput } from './TagInput';
import { Padded } from '../storybook.helpers';

const SUGGESTIONS = ['dyno', 'crimpy', 'slab', 'overhang', 'balance'];

const meta = {
  title: 'Molecules/TagInput',
  component: TagInput,
  decorators: [Padded],
  args: { label: 'Strengths', tags: ['dyno'], suggestions: SUGGESTIONS, onAdd: fn(), onRemove: fn() },
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['dyno']);
    return (
      <TagInput
        {...args}
        tags={tags}
        onAdd={(tag) => setTags((current) => (current.includes(tag) ? current : [...current, tag]))}
        onRemove={(tag) => setTags((current) => current.filter((t) => t !== tag))}
      />
    );
  },
};
