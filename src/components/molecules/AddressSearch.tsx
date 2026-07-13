import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';

import { ADDRESS_SUGGESTIONS } from '../../constants/mockData';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { TextField } from '../atoms/TextField';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';

export function AddressSearch({
  onSelect,
  error,
  required = true,
}: {
  onSelect: (address: string) => void;
  error?: string;
  required?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [showAddAnyway, setShowAddAnyway] = useState(false);

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) return [];
    return ADDRESS_SUGGESTIONS.filter((item) => item.toLowerCase().includes(trimmed));
  }, [query]);

  const handleChange = (value: string) => {
    setQuery(value);
    setShowAddAnyway(false);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    if (suggestions.length > 0) {
      onSelect(suggestions[0]);
      setQuery('');
      setShowAddAnyway(false);
      return;
    }
    setShowAddAnyway(true);
  };

  const selectSuggestion = (item: string) => {
    onSelect(item);
    setQuery('');
    setShowAddAnyway(false);
  };

  return (
    <View style={{ gap: 8 }}>
      <View style={{ zIndex: 2 }}>
        <TextField
          label="Location"
          required={required}
          value={query}
          onChangeText={handleChange}
          placeholder="Search address or gym name"
          error={error}
        />
        {suggestions.length > 0 ? (
          <View
            style={{
              marginTop: 4,
              maxHeight: 180,
              borderWidth: 1,
              borderColor: ui.border,
              borderRadius: 8,
              backgroundColor: ui.surface,
              overflow: 'hidden',
              ...(Platform.OS === 'web'
                ? { boxShadow: `0 4px 12px ${ui.shadowSoft}` }
                : {
                    shadowColor: ui.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 4,
                  }),
            }}
          >
            <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
              {suggestions.map((item, index) => (
                <Pressable
                  key={item}
                  onPress={() => selectSuggestion(item)}
                  style={(state) => [
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderTopWidth: index === 0 ? 0 : 1,
                      borderTopColor: ui.borderSubtle,
                      backgroundColor: ui.surface,
                    },
                    interactionStyle(state),
                  ]}
                >
                  <Text variant="body">{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>

      {query.trim().length >= 2 && suggestions.length === 0 && !showAddAnyway ? (
        <Text variant="bodySmall" color={ui.textMuted}>
          No matches found.
        </Text>
      ) : null}

      {showAddAnyway ? (
        <View style={{ gap: 8 }}>
          <Text variant="bodySmall" color={ui.textMuted}>
            Address not found. You can add it anyway.
          </Text>
          <Button
            label={`Add "${query.trim()}" anyway`}
            variant="secondary"
            onPress={() => selectSuggestion(query.trim())}
          />
        </View>
      ) : (
        <Button label="Search" variant="secondary" onPress={handleSubmit} />
      )}
    </View>
  );
}
