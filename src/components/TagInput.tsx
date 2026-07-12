import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { WireframeButton } from './Wireframe';
import { ui } from '../theme/colors';

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
          <Pressable
            key={tag}
            onPress={() => onRemove(tag)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderWidth: 1,
              borderColor: ui.borderStrong,
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: ui.surfaceMuted,
            }}
          >
            <Text>{tag}</Text>
            <Text style={{ fontWeight: '700' }}>×</Text>
          </Pressable>
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
        <WireframeButton label="Add" variant="secondary" onPress={handleAdd} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {suggestions
          .filter((item) => !tags.includes(item))
          .map((item) => (
            <Pressable
              key={item}
              onPress={() => onAdd(item)}
              style={{
                borderWidth: 1,
                borderColor: ui.border,
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text>+ {item}</Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
}
