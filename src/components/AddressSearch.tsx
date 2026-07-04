import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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

  return (
    <View style={{ gap: 8 }}>
      <WireframeField
        label="Location"
        required={required}
        value={query}
        onChangeText={handleChange}
        placeholder="Search address or gym name"
        error={error}
      />
      {suggestions.length > 0 ? (
        <View style={{ gap: 6 }}>
          {suggestions.map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                onSelect(item);
                setQuery('');
                setShowAddAnyway(false);
              }}
              style={{
                borderWidth: 1,
                borderColor: '#CCC',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#FFF',
              }}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
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
            onPress={() => {
              onSelect(query.trim());
              setQuery('');
              setShowAddAnyway(false);
            }}
          />
        </View>
      ) : (
        <WireframeButton label="Search" variant="secondary" onPress={handleSubmit} />
      )}
    </View>
  );
}
