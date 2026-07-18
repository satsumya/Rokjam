import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { BottomSheet } from './BottomSheet';
import { ColorPicker } from './ColorPicker';
import { DEFAULT_LEVEL_COLORS } from '../../constants/difficultyLevels';
import { ui } from '../../theme/colors';
import { colorPickerGeometry } from '../../theme/colorPicker';
import { focusRing, interactionStyle, useHoverFocus } from '../../theme/interaction';
import { bodySizes, fontFamilies } from '../../theme/typography';
import { space } from '../../theme/spacing';
import { normalizeHex } from '../../utils/color';

type Level = {
  id: string;
  name: string;
  color: string;
};

const ROW_DRAG_STEP = 56;

function normalizeColor(value: string) {
  return value.trim().toLowerCase();
}

export function LevelRow({
  level,
  index,
  total,
  takenColors,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onRemove,
  onReorder,
}: {
  level: Level;
  index: number;
  total: number;
  /** Colours already used by other levels at this location (exclude this row’s colour). */
  takenColors: string[];
  onUpdate: (patch: Partial<Level>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const [draftColor, setDraftColor] = useState(level.color);
  const nameField = useHoverFocus();
  const colorError = !level.color.trim() ? 'Colour is required' : undefined;

  const taken = useMemo(
    () => new Set(takenColors.map(normalizeColor).filter(Boolean)),
    [takenColors],
  );

  const availablePresets = useMemo(() => {
    const current = normalizeColor(level.color);
    return DEFAULT_LEVEL_COLORS.filter((preset) => {
      const value = normalizeColor(preset.color);
      return value === current || !taken.has(value);
    });
  }, [level.color, taken]);

  const translateY = useSharedValue(0);
  const dragging = useSharedValue(false);

  const applyReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    onReorder(fromIndex, toIndex);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      dragging.value = true;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const delta = Math.round(event.translationY / ROW_DRAG_STEP);
      const toIndex = Math.max(0, Math.min(total - 1, index + delta));
      translateY.value = withSpring(0);
      dragging.value = false;
      if (toIndex !== index) {
        runOnJS(applyReorder)(index, toIndex);
      }
    })
    .onFinalize(() => {
      translateY.value = withSpring(0);
      dragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: dragging.value ? 20 : 1,
    opacity: dragging.value ? 0.95 : 1,
  }));

  const openColorSheet = () => {
    setDraftColor(level.color);
    setColorSheetOpen(true);
  };

  const selectPreset = (preset: (typeof DEFAULT_LEVEL_COLORS)[number]) => {
    const matchesPresetName = DEFAULT_LEVEL_COLORS.some((item) => item.name === level.name);
    onUpdate({
      color: preset.color,
      ...(matchesPresetName || !level.name.trim() ? { name: preset.name } : null),
    });
    setDraftColor(preset.color);
    setColorSheetOpen(false);
  };

  const applyCustomColor = () => {
    const next = normalizeHex(draftColor) ?? draftColor.trim();
    if (!next) return;
    onUpdate({ color: next });
    setColorSheetOpen(false);
  };

  return (
    <>
      <Animated.View
        style={[
          {
            borderWidth: 1,
            borderColor: ui.borderSubtle,
            borderRadius: 8,
            padding: space[8],
            backgroundColor: ui.surface,
            gap: space[6],
          },
          animatedStyle,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[6] }}>
          <GestureDetector gesture={pan}>
            <Animated.View
              accessibilityRole="button"
              accessibilityLabel="Drag to reorder level"
              style={{
                flexShrink: 0,
                paddingHorizontal: space[4],
                paddingVertical: space[4],
                borderWidth: 1,
                borderColor: ui.border,
                borderRadius: 4,
              }}
            >
              <Icon name="dragHandle" size="sm" color={ui.textMuted} />
            </Animated.View>
          </GestureDetector>

          <Pressable
            onPress={openColorSheet}
            accessibilityRole="button"
            accessibilityLabel="Change level colour"
            style={(state) => [{ flexShrink: 0, borderRadius: 4 }, interactionStyle(state)]}
          >
            <View
              style={{
                width: colorPickerGeometry.rowSwatch,
                height: colorPickerGeometry.rowSwatch,
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
                minWidth: 0,
                borderWidth: 1,
                borderColor: nameField.hovered ? ui.borderStrong : ui.border,
                borderRadius: 6,
                paddingHorizontal: space[8],
                paddingVertical: space[6],
                fontFamily: fontFamilies.bodyRegular,
                fontSize: bodySizes.base,
                color: ui.text,
              },
              nameField.focused ? focusRing : null,
            ]}
          />

          <View style={{ flexShrink: 0, gap: 2 }}>
            <Pressable
              onPress={onMoveUp}
              disabled={index === 0}
              hitSlop={4}
              style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
            >
              <Icon name="arrowUp" size="xs" color={ui.text} style={{ opacity: index === 0 ? 0.3 : 1 }} />
            </Pressable>
            <Pressable
              onPress={onMoveDown}
              disabled={index === total - 1}
              hitSlop={4}
              style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
            >
              <Icon
                name="arrowDown"
                size="xs"
                color={ui.text}
                style={{ opacity: index === total - 1 ? 0.3 : 1 }}
              />
            </Pressable>
          </View>
          {total > 1 ? (
            <Pressable
              onPress={onRemove}
              hitSlop={4}
              style={(state) => [{ flexShrink: 0, borderRadius: 4 }, interactionStyle(state)]}
            >
              <Icon name="close" size="xs" color={ui.danger} />
            </Pressable>
          ) : null}
        </View>

        {colorError ? (
          <Text variant="bodySmall" color={ui.danger} style={{ paddingLeft: space[32] }}>
            {colorError}
          </Text>
        ) : null}
      </Animated.View>

      <BottomSheet
        visible={colorSheetOpen}
        title="Level colour"
        onClose={() => setColorSheetOpen(false)}
      >
        <Text variant="bodySmall" color={ui.textMuted}>
          Only unused colours are listed. Pick a preset or mix a custom colour.
        </Text>

        {availablePresets.length === 0 ? (
          <Text variant="bodySmall" color={ui.textMuted}>
            All preset colours are in use. Mix a custom colour below.
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
            {availablePresets.map((preset) => {
              const selected = normalizeColor(preset.color) === normalizeColor(draftColor);
              return (
                <Pressable
                  key={preset.id}
                  accessibilityRole="button"
                  accessibilityLabel={preset.name}
                  onPress={() => selectPreset(preset)}
                  style={(state) => [
                    {
                      width: colorPickerGeometry.presetSwatch,
                      height: colorPickerGeometry.presetSwatch,
                      borderRadius: 8,
                      backgroundColor: preset.color,
                      borderWidth: selected ? 2 : 1,
                      borderColor: selected ? ui.borderStrong : ui.border,
                    },
                    interactionStyle(state),
                  ]}
                />
              );
            })}
          </View>
        )}

        <ColorPicker value={draftColor} onChange={setDraftColor} />
        <Button label="Use custom colour" variant="secondary" onPress={applyCustomColor} />
        <Button label="Cancel" variant="ghost" onPress={() => setColorSheetOpen(false)} />
      </BottomSheet>
    </>
  );
}
