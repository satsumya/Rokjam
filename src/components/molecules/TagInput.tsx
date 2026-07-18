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

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
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
            onChangeText={setDraft}
            placeholder="Add a tag"
            accessibilityLabel={`Add ${label.toLowerCase()} tag`}
          />
        </TagComposerField>
        <Button label="Add" variant="secondary" onPress={handleAdd} />
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
