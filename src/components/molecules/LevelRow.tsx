import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Icon } from '../atoms/Icon';
import { DEFAULT_LEVEL_COLORS } from '../../constants/difficultyLevels';
import { ui } from '../../theme/colors';
import { focusRing, interactionStyle, useHoverFocus } from '../../theme/interaction';

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
  const nameField = useHoverFocus();
  const hexField = useHoverFocus();
  const colorError = !level.color.trim() ? 'Colour is required' : undefined;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: dragSourceId === level.id ? ui.borderStrong : ui.borderSubtle,
        borderRadius: 8,
        padding: 8,
        backgroundColor: ui.surface,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Pressable
          onPress={() => (dragSourceId ? onDragTarget(level.id) : onDragStart(level.id))}
          style={(state) => [
            {
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: ui.border,
              borderRadius: 4,
            },
            interactionStyle(state),
          ]}
        >
          <Icon name="dragHandle" size={18} color={ui.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => setShowColors((current) => !current)}
          style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              backgroundColor: level.color || ui.borderSubtle,
              borderWidth: 1,
              borderColor: colorError ? ui.danger : ui.border,
            }}
          />
        </Pressable>
        <TextInput
          value={level.name}
          onChangeText={(name) => onUpdate({ name })}
          placeholder="Level label"
          {...(nameField.bind as object)}
          style={[
            {
              flex: 1,
              borderWidth: 1,
              borderColor: nameField.hovered ? ui.borderStrong : ui.border,
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 6,
              fontSize: 15,
            },
            nameField.focused ? focusRing : null,
          ]}
        />
        <Pressable
          onPress={onMoveUp}
          disabled={index === 0}
          style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
        >
          <Icon name="arrowUp" size={16} color={ui.text} style={{ opacity: index === 0 ? 0.3 : 1 }} />
        </Pressable>
        <Pressable
          onPress={onMoveDown}
          disabled={index === total - 1}
          style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
        >
          <Icon
            name="arrowDown"
            size={16}
            color={ui.text}
            style={{ opacity: index === total - 1 ? 0.3 : 1 }}
          />
        </Pressable>
        {total > 1 ? (
          <Pressable onPress={onRemove} style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}>
            <Icon name="close" size={16} color={ui.danger} weight="bold" />
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
              style={(state) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: ui.borderSubtle,
                  borderRadius: 6,
                },
                interactionStyle(state),
              ]}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: preset.color,
                  borderWidth: 1,
                  borderColor: ui.border,
                }}
              />
              <Text>{preset.name}</Text>
            </Pressable>
          ))}
          <TextInput
            value={level.color}
            onChangeText={(color) => onUpdate({ color })}
            placeholder="#HEX custom colour"
            {...(hexField.bind as object)}
            style={[
              {
                borderWidth: 1,
                borderColor: hexField.hovered ? ui.borderStrong : ui.border,
                borderRadius: 8,
                padding: 10,
                fontSize: 16,
              },
              hexField.focused ? focusRing : null,
            ]}
          />
        </View>
      ) : null}
      {colorError ? <Text style={{ color: ui.danger, fontSize: 13, paddingLeft: 36 }}>{colorError}</Text> : null}
    </View>
  );
}
