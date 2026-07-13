import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button } from '../atoms/Button';
import { Chip, RemovableChip } from '../atoms/Chip';
import { ui } from '../../theme/colors';

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
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: ui.text }}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((tag) => (
          <RemovableChip key={tag} label={tag} onPress={() => onRemove(tag)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a tag"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: ui.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
          }}
        />
        <Button label="Add" variant="secondary" onPress={handleAdd} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {suggestions
          .filter((item) => !tags.includes(item))
          .map((item) => (
            <Chip key={item} label={`+ ${item}`} onPress={() => onAdd(item)} />
          ))}
      </View>
    </View>
  );
}
