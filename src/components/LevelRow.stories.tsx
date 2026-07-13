import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { LevelRow } from './LevelRow';
import { demoLevels, Padded } from './storybook.helpers';

const meta = {
  title: 'Components/LevelRow',
  component: LevelRow,
  decorators: [Padded],
  args: {
    level: demoLevels[0],
    index: 0,
    total: 1,
    dragSourceId: null,
    onUpdate: () => {},
    onMoveUp: () => {},
    onMoveDown: () => {},
    onRemove: () => {},
    onDragStart: () => {},
    onDragTarget: () => {},
  },
} satisfies Meta<typeof LevelRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => {
    const [level, setLevel] = useState(demoLevels[0]);
    return (
      <LevelRow
        level={level}
        index={0}
        total={1}
        dragSourceId={null}
        onUpdate={(patch) => setLevel((current) => ({ ...current, ...patch }))}
        onMoveUp={() => {}}
        onMoveDown={() => {}}
        onRemove={() => {}}
        onDragStart={() => {}}
        onDragTarget={() => {}}
      />
    );
  },
};

export const ReorderableList: Story = {
  render: () => {
    const [levels, setLevels] = useState(demoLevels.slice(0, 3));
    const [dragSourceId, setDragSourceId] = useState<string | null>(null);

    const swap = (fromId: string, toId: string) => {
      setLevels((current) => {
        const from = current.findIndex((l) => l.id === fromId);
        const to = current.findIndex((l) => l.id === toId);
        if (from < 0 || to < 0) return current;
        const next = [...current];
        [next[from], next[to]] = [next[to], next[from]];
        return next;
      });
    };

    return (
      <View style={{ gap: 8 }}>
        {levels.map((level, index) => (
          <LevelRow
            key={level.id}
            level={level}
            index={index}
            total={levels.length}
            dragSourceId={dragSourceId}
            onUpdate={(patch) =>
              setLevels((current) =>
                current.map((l) => (l.id === level.id ? { ...l, ...patch } : l)),
              )
            }
            onMoveUp={() => index > 0 && swap(level.id, levels[index - 1].id)}
            onMoveDown={() => index < levels.length - 1 && swap(level.id, levels[index + 1].id)}
            onRemove={() =>
              setLevels((current) => current.filter((l) => l.id !== level.id))
            }
            onDragStart={setDragSourceId}
            onDragTarget={(targetId) => {
              if (dragSourceId) {
                swap(dragSourceId, targetId);
                setDragSourceId(null);
              }
            }}
          />
        ))}
      </View>
    );
  },
};
