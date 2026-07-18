import { useState } from 'react';
import { View, type ViewProps } from 'react-native';

import { Button } from '../atoms/Button';
import { Chip, RemovableChip } from '../atoms/Chip';
import { Section } from '../atoms/Section';
import { TextField } from '../atoms/TextField';
import { space } from '../../theme/spacing';

function TagChipRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TagComposerRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TagComposerField({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TagSuggestionRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Split a draft on commas into trimmed non-empty tag labels. */
export function parseTagDraft(draft: string): string[] {
  return draft
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function addTagsFromList(
  parts: string[],
  existing: string[],
  onAdd: (tag: string) => void,
) {
  for (const tag of parts) {
    if (!existing.includes(tag)) onAdd(tag);
  }
}

export function TagInput({
  label,
  tags,
  suggestions,
  onAdd,
  onRemove,
}: {
  label: string;
  tags: string[];
  suggestions: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  const [draft, setDraft] = useState('');

  const commitDraft = (value: string) => {
    addTagsFromList(parseTagDraft(value), tags, onAdd);
    setDraft('');
  };

  const handleChange = (value: string) => {
    // Comma commits completed segments immediately; keep the trailing fragment as draft.
    if (!value.includes(',')) {
      setDraft(value);
      return;
    }
    const parts = value.split(',');
    const complete = parts.slice(0, -1).map((part) => part.trim()).filter(Boolean);
    addTagsFromList(complete, tags, onAdd);
    setDraft(parts[parts.length - 1] ?? '');
  };

  return (
    <Section title={label}>
      {tags.length ? (
        <TagChipRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
          {tags.map((tag) => (
            <RemovableChip key={tag} label={tag} onPress={() => onRemove(tag)} />
          ))}
        </TagChipRow>
      ) : null}
      <TagComposerRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8], alignItems: 'flex-end' }}>
        <TagComposerField style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
          <TextField
            value={draft}
            onChangeText={handleChange}
            placeholder="Add a tag"
            accessibilityLabel={`Add ${label.toLowerCase()} tag`}
            returnKeyType="done"
            onSubmitEditing={() => commitDraft(draft)}
          />
        </TagComposerField>
        <Button
          icon="plus"
          variant="secondary"
          size="medium"
          accessibilityLabel="Add tag"
          onPress={() => commitDraft(draft)}
        />
      </TagComposerRow>
      <TagSuggestionRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
        {suggestions
          .filter((item) => !tags.includes(item))
          .map((item) => (
            <Chip key={item} label={`+ ${item}`} onPress={() => onAdd(item)} />
          ))}
      </TagSuggestionRow>
    </Section>
  );
}
