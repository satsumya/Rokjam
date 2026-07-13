import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import { TagInput } from './TagInput';
import { Padded } from './storybook.helpers';

const SUGGESTIONS = ['Slab', 'Balance', 'Overhangs', 'Endurance', 'Crimp strength'];

const meta = {
  title: 'Components/TagInput',
  component: TagInput,
  decorators: [Padded],
  args: {
    label: 'Strengths',
    tags: [],
    suggestions: SUGGESTIONS,
    onAdd: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <TagInput
        label="Strengths"
        tags={tags}
        suggestions={SUGGESTIONS}
        onAdd={(tag) => setTags((current) => (current.includes(tag) ? current : [...current, tag]))}
        onRemove={(tag) => setTags((current) => current.filter((t) => t !== tag))}
      />
    );
  },
};

export const WithTags: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(['Slab', 'Balance']);
    return (
      <TagInput
        label="Strengths"
        tags={tags}
        suggestions={SUGGESTIONS}
        onAdd={(tag) => setTags((current) => (current.includes(tag) ? current : [...current, tag]))}
        onRemove={(tag) => setTags((current) => current.filter((t) => t !== tag))}
      />
    );
  },
};
