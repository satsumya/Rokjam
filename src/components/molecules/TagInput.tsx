import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '../atoms/Button';
import { Chip, RemovableChip } from '../atoms/Chip';
import { Text } from '../atoms/Text';
import { ui } from '../../theme/colors';
import { focusRing, useHoverFocus } from '../../theme/interaction';
import { bodySizes, fontFamilies } from '../../theme/typography';
import { space } from '../../theme/spacing';

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
  const { hovered, focused, bind } = useHoverFocus();

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
  };

  return (
    <View style={{ gap: space[8] }}>
      <Text variant="body" weight="bold">
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
        {tags.map((tag) => (
          <RemovableChip key={tag} label={tag} onPress={() => onRemove(tag)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: space[8] }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a tag"
          {...(bind as object)}
          style={[
            {
              flex: 1,
              borderWidth: 1,
              borderColor: hovered ? ui.borderStrong : ui.border,
              borderRadius: 8,
              paddingHorizontal: space[12],
              paddingVertical: space[12],
              fontFamily: fontFamilies.bodyRegular,
              fontSize: bodySizes.base,
              color: ui.text,
            },
            focused ? focusRing : null,
          ]}
        />
        <Button label="Add" variant="secondary" onPress={handleAdd} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
        {suggestions
          .filter((item) => !tags.includes(item))
          .map((item) => (
            <Chip key={item} label={`+ ${item}`} onPress={() => onAdd(item)} />
          ))}
      </View>
    </View>
  );
}
