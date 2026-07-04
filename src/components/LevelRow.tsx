import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { DEFAULT_LEVEL_COLORS } from '../constants/difficultyLevels';

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
        borderColor: dragSourceId === level.id ? '#111' : '#EEE',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#FFF',
        gap: 6,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Pressable
          onPress={() => (dragSourceId ? onDragTarget(level.id) : onDragStart(level.id))}
          style={{
            paddingHorizontal: 6,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: '#CCC',
            borderRadius: 4,
          }}
        >
          <Text>⋮⋮</Text>
        </Pressable>
        <Pressable onPress={() => setShowColors((current) => !current)}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              backgroundColor: level.color || '#EEE',
              borderWidth: 1,
              borderColor: colorError ? '#C0392B' : '#CCC',
            }}
          />
        </Pressable>
        <TextInput
          value={level.name}
          onChangeText={(name) => onUpdate({ name })}
          placeholder="Level label"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#CCC',
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            fontSize: 15,
          }}
        />
        <Pressable onPress={onMoveUp} disabled={index === 0}>
          <Text style={{ opacity: index === 0 ? 0.3 : 1, fontSize: 16 }}>↑</Text>
        </Pressable>
        <Pressable onPress={onMoveDown} disabled={index === total - 1}>
          <Text style={{ opacity: index === total - 1 ? 0.3 : 1, fontSize: 16 }}>↓</Text>
        </Pressable>
        {total > 1 ? (
          <Pressable onPress={onRemove}>
            <Text style={{ color: '#C0392B', fontWeight: '600' }}>×</Text>
          </Pressable>
        ) : null}
      </View>

      {showColors ? (
        <View style={{ gap: 6, paddingLeft: 36 }}>
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
                padding: 6,
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
      {colorError ? <Text style={{ color: '#C0392B', fontSize: 13, paddingLeft: 36 }}>{colorError}</Text> : null}
    </View>
  );
}
