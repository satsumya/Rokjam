import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { DEFAULT_LEVEL_COLORS } from '../constants/difficultyLevels';
import { WireframeButton, WireframeField } from './Wireframe';

type Level = {
  id: string;
  name: string;
  color: string;
};

export function LevelRow({
  level,
  index,
  total,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDragStart,
  onDragTarget,
  dragSourceId,
}: {
  level: Level;
  index: number;
  total: number;
  onUpdate: (patch: Partial<Level>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onDragStart: (id: string) => void;
  onDragTarget: (id: string) => void;
  dragSourceId: string | null;
}) {
  const [showColors, setShowColors] = useState(false);
  const colorError = !level.color.trim() ? 'Colour is required' : undefined;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: dragSourceId === level.id ? '#111' : '#DDD',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#FFF',
        gap: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={() => (dragSourceId ? onDragTarget(level.id) : onDragStart(level.id))}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: '#CCC',
            borderRadius: 4,
          }}
        >
          <Text>⋮⋮</Text>
        </Pressable>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            backgroundColor: level.color,
            borderWidth: 1,
            borderColor: '#CCC',
          }}
        />
        <Text style={{ flex: 1, fontWeight: '600' }}>{level.name || `Level ${index + 1}`}</Text>
        <WireframeButton label="↑" variant="secondary" onPress={onMoveUp} disabled={index === 0} />
        <WireframeButton
          label="↓"
          variant="secondary"
          onPress={onMoveDown}
          disabled={index === total - 1}
        />
        {total > 1 ? (
          <Pressable onPress={onRemove}>
            <Text style={{ color: '#C0392B', fontWeight: '600' }}>Remove</Text>
          </Pressable>
        ) : null}
      </View>

      <WireframeField
        label="Level label"
        value={level.name}
        onChangeText={(name) => onUpdate({ name })}
      />

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>Colour</Text>
        <Pressable
          onPress={() => setShowColors((current) => !current)}
          style={{
            borderWidth: 1,
            borderColor: colorError ? '#C0392B' : '#CCC',
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>{level.color || 'Choose colour'}</Text>
          <Text>{showColors ? '▲' : '▼'}</Text>
        </Pressable>
        {showColors ? (
          <View style={{ gap: 6 }}>
            {DEFAULT_LEVEL_COLORS.map((preset) => (
              <Pressable
                key={preset.color}
                onPress={() => {
                  onUpdate({ name: level.name || preset.name, color: preset.color });
                  setShowColors(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: '#EEE',
                  borderRadius: 6,
                }}
              >
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: preset.color,
                    borderWidth: 1,
                    borderColor: '#CCC',
                  }}
                />
                <Text>{preset.name}</Text>
              </Pressable>
            ))}
            <TextInput
              value={level.color}
              onChangeText={(color) => onUpdate({ color })}
              placeholder="#HEX custom colour"
              style={{
                borderWidth: 1,
                borderColor: '#CCC',
                borderRadius: 8,
                padding: 10,
                fontSize: 16,
              }}
            />
          </View>
        ) : null}
        {colorError ? <Text style={{ color: '#C0392B', fontSize: 13 }}>{colorError}</Text> : null}
      </View>
    </View>
  );
}
