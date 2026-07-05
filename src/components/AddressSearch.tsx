import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { ADDRESS_SUGGESTIONS } from '../constants/mockData';
import { WireframeButton, WireframeField } from './Wireframe';

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
        <WireframeField
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
              borderColor: '#CCC',
              borderRadius: 8,
              backgroundColor: '#FFF',
              overflow: 'hidden',
              ...(Platform.OS === 'web'
                ? { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' as const }
                : {
                    shadowColor: '#000',
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
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: '#EEE',
                    backgroundColor: '#FFF',
                  }}
                >
                  <Text>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>

      {query.trim().length >= 2 && suggestions.length === 0 && !showAddAnyway ? (
        <Text style={{ color: '#666', fontSize: 13 }}>No matches found.</Text>
      ) : null}

      {showAddAnyway ? (
        <View style={{ gap: 8 }}>
          <Text style={{ color: '#666', fontSize: 13 }}>
            Address not found. You can add it anyway.
          </Text>
          <WireframeButton
            label={`Add "${query.trim()}" anyway`}
            variant="secondary"
            onPress={() => selectSuggestion(query.trim())}
          />
        </View>
      ) : (
        <WireframeButton label="Search" variant="secondary" onPress={handleSubmit} />
      )}
    </View>
  );
}
