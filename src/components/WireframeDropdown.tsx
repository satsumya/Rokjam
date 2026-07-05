import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { WireframeField } from './Wireframe';

export type DropdownOption = {
  value: string;
  label: string;
};

export function WireframeDropdown({
  label,
  value,
  options,
  onChange,
  customValue,
  onCustomChange,
  customPlaceholder,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  customPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? value;

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: '600', fontSize: 14 }}>{label}</Text>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        accessibilityRole="button"
        style={{
          borderWidth: 1,
          borderColor: '#CCC',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: '#FFF',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, color: '#111' }}>{displayLabel}</Text>
        <Text style={{ color: '#666' }}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#CCC',
            borderRadius: 8,
            backgroundColor: '#FFF',
            overflow: 'hidden',
          }}
        >
          {options.map((option, index) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: '#EEE',
                backgroundColor: option.value === value ? '#F5F5F5' : '#FFF',
              }}
            >
              <Text style={{ fontWeight: option.value === value ? '700' : '400' }}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {onCustomChange ? (
        <WireframeField
          label="Custom"
          value={customValue ?? ''}
          onChangeText={onCustomChange}
          placeholder={customPlaceholder ?? 'Type a custom value'}
        />
      ) : null}
    </View>
  );
}
