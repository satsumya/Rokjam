import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { TextField } from '../atoms/TextField';
import { Modal } from '../molecules/Modal';
import { AddressSearch } from '../molecules/AddressSearch';
import { LevelRow } from '../molecules/LevelRow';
import { DEFAULT_LEVEL_COLORS } from '../../constants/difficultyLevels';
import type { DifficultyLevel } from '../../context/PrototypeContext';
import { usePrototype } from '../../context/PrototypeContext';
import { colors, ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

function createDraftLevel(index: number): DifficultyLevel {
  const preset = DEFAULT_LEVEL_COLORS[index];
  return {
    id: `draft-level-${index}-${Date.now()}`,
    name: preset?.name ?? 'Custom',
    color: preset?.color ?? colors.neutral[400],
  };
}

export function AddLocationSheet({
  visible,
  onClose,
  onSaved,
}: {
  visible: boolean;
  onClose: () => void;
  onSaved: (locationId: string, locationName: string) => void;
}) {
  const { addLocationWithLevels } = usePrototype();
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [levels, setLevels] = useState<DifficultyLevel[]>([createDraftLevel(0)]);
  const [dragSourceId, setDragSourceId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setAddress('');
    setNickname('');
    setLevels([createDraftLevel(0)]);
    setDragSourceId(null);
    setError('');
  }, [visible]);

  const handleSelectAddress = (value: string) => {
    setAddress(value);
    setError('');
  };

  const updateDraftLevel = (levelId: string, patch: Partial<DifficultyLevel>) => {
    setLevels((current) =>
      current.map((level) => (level.id === levelId ? { ...level, ...patch } : level)),
    );
  };

  const handleSave = () => {
    if (!address.trim()) {
      setError('Search and select a location first');
      return;
    }
    if (levels.some((level) => !level.color.trim())) {
      setError('Each difficulty level needs a colour');
      return;
    }

    const id = addLocationWithLevels(address.trim(), nickname.trim() || undefined, levels);
    onSaved(id, address.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Add climbing location"
      onClose={onClose}
      footer={
        <>
          {address ? <Button label="Save location" onPress={handleSave} /> : null}
          <Button label="Cancel" variant="ghost" onPress={onClose} />
        </>
      }
    >
      <Text variant="body" color={ui.textMuted}>
        Search for your gym or crag, then set up difficulty levels for this location.
      </Text>

      {!address ? (
        <AddressSearch onSelect={handleSelectAddress} error={error} required />
      ) : (
        <View style={{ gap: space[12] }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: ui.border,
              borderRadius: 8,
              padding: space[12],
              backgroundColor: ui.surfaceMuted,
              gap: space[4],
            }}
          >
            <Text variant="body" weight="bold">
              Selected location
            </Text>
            <Text variant="body">{address}</Text>
            <Button
              label="Change location"
              variant="ghost"
              onPress={() => {
                setAddress('');
                setError('');
              }}
            />
          </View>

          <TextField
            label="Nickname"
            value={nickname}
            onChangeText={setNickname}
            placeholder="e.g. Home gym"
          />

          <Text variant="body" weight="bold">
            Difficulty levels
          </Text>
          <Text variant="bodySmall" color={ui.textMuted}>
            Add the colour grades used at this location. You need at least one level.
          </Text>

          <View style={{ gap: space[8] }}>
            {levels.map((level, index) => (
              <LevelRow
                key={level.id}
                level={level}
                index={index}
                total={levels.length}
                dragSourceId={dragSourceId}
                onUpdate={(patch) => updateDraftLevel(level.id, patch)}
                onMoveUp={() => {
                  if (index === 0) return;
                  const next = [...levels];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  setLevels(next);
                }}
                onMoveDown={() => {
                  if (index >= levels.length - 1) return;
                  const next = [...levels];
                  [next[index], next[index + 1]] = [next[index + 1], next[index]];
                  setLevels(next);
                }}
                onRemove={() => {
                  if (levels.length <= 1) return;
                  setLevels((current) => current.filter((item) => item.id !== level.id));
                }}
                onDragStart={setDragSourceId}
                onDragTarget={(targetId) => {
                  if (!dragSourceId || dragSourceId === targetId) return;
                  const fromIndex = levels.findIndex((item) => item.id === dragSourceId);
                  const toIndex = levels.findIndex((item) => item.id === targetId);
                  if (fromIndex < 0 || toIndex < 0) return;
                  const next = [...levels];
                  [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
                  setLevels(next);
                  setDragSourceId(null);
                }}
              />
            ))}
          </View>

          <Button
            label="Add level"
            variant="secondary"
            onPress={() => setLevels((current) => [...current, createDraftLevel(current.length)])}
          />
        </View>
      )}

      {error && address ? (
        <Text variant="body" color={ui.danger}>
          {error}
        </Text>
      ) : null}
    </Modal>
  );
}
