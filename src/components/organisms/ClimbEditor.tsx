import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { CheckboxRow } from '../atoms/CheckboxRow';
import { Icon } from '../atoms/Icon';
import { ToggleChip } from '../atoms/ToggleChip';
import { Section } from '../atoms/Section';
import { TextField } from '../atoms/TextField';
import { DifficultyPicker } from '../molecules/DifficultyPicker';
import type { Location } from '../../context/PrototypeContext';
import type { SessionClimb } from '../../types/climbingSession';
import {
  attemptProgressOptionsForIndex,
  ATTEMPT_PROGRESS_OPTIONS,
  CLIMB_TAG_SUGGESTIONS,
  nextAttemptProgress,
} from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import { focusRing, interactionStyle, useHoverFocus } from '../../theme/interaction';

type ClimbEditorProps = {
  climb: SessionClimb;
  location?: Location;
  onChange: (patch: Partial<SessionClimb>) => void;
  onShare?: () => void;
};

export function ClimbEditor({ climb, location, onChange, onShare }: ClimbEditorProps) {
  const [customTag, setCustomTag] = useState('');
  const customTagField = useHoverFocus();

  const toggleTag = (tag: string) => {
    const next = climb.tags.includes(tag)
      ? climb.tags.filter((t) => t !== tag)
      : [...climb.tags, tag];
    onChange({ tags: next });
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim().toLowerCase();
    if (!trimmed || climb.tags.includes(trimmed)) return;
    onChange({ tags: [...climb.tags, trimmed] });
    setCustomTag('');
  };

  const toggleProgress = (attemptId: string, value: (typeof ATTEMPT_PROGRESS_OPTIONS)[number]['value']) => {
    onChange({
      attempts: climb.attempts.map((attempt) => {
        if (attempt.id !== attemptId) return attempt;
        return { ...attempt, progress: nextAttemptProgress(attempt.progress, value) };
      }),
    });
  };

  const addAttempt = () => {
    onChange({
      attempts: [...climb.attempts, { id: `${Date.now()}`, progress: [] }],
    });
  };

  const removeAttempt = (attemptId: string) => {
    if (climb.attempts.length <= 1) return;
    onChange({ attempts: climb.attempts.filter((a) => a.id !== attemptId) });
  };

  return (
    <Card>
      <Section title="Climb details">
        <TextField
          label="Name or wall name"
          value={climb.name ?? ''}
          onChangeText={(name) => onChange({ name })}
          placeholder="e.g. Comp wall dyno"
        />
        {location?.levels.length ? (
          <DifficultyPicker
            title="Difficulty"
            levels={location.levels}
            selectedLevelId={climb.levelId}
            onSelect={(level) =>
              onChange({ levelId: level.id, levelName: level.name, levelColor: level.color })
            }
          />
        ) : (
          <Text style={{ color: ui.textMuted }}>Add a location with levels to pick difficulty.</Text>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <CheckboxRow label="Warm-up" checked={climb.isWarmUp} onPress={() => onChange({ isWarmUp: !climb.isWarmUp })} />
          <CheckboxRow label="Repeat" checked={climb.isRepeat} onPress={() => onChange({ isRepeat: !climb.isRepeat })} />
          <CheckboxRow label="Project" checked={climb.isProject} onPress={() => onChange({ isProject: !climb.isProject })} />
        </View>
        <TextField
          label="Notes"
          value={climb.notes ?? ''}
          onChangeText={(notes) => onChange({ notes })}
          placeholder="Optional notes"
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            label={climb.hasImage ? 'Replace image' : 'Add image'}
            variant="secondary"
            onPress={() => onChange({ hasImage: true })}
          />
          <Button
            label={climb.hasVideo ? 'Replace video' : 'Add video'}
            variant="secondary"
            onPress={() => onChange({ hasVideo: true })}
          />
        </View>
      </Section>

      <Section title="Tags">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {CLIMB_TAG_SUGGESTIONS.map((tag) => (
            <ToggleChip
              key={tag}
              label={tag}
              selected={climb.tags.includes(tag)}
              onPress={() => toggleTag(tag)}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TextInput
            value={customTag}
            onChangeText={setCustomTag}
            placeholder="Custom tag"
            {...(customTagField.bind as object)}
            style={[
              {
                flex: 1,
                borderWidth: 1,
                borderColor: customTagField.hovered ? ui.borderStrong : ui.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 16,
              },
              customTagField.focused ? focusRing : null,
            ]}
          />
          <Button label="Add tag" variant="secondary" onPress={addCustomTag} />
        </View>
        {climb.tags.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {climb.tags.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => toggleTag(tag)}
                style={(state) => [
                  { borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
                  interactionStyle(state),
                ]}
              >
                <Text style={{ textDecorationLine: 'underline' }}>{tag}</Text>
                <Icon name="close" size={13} color={ui.text} />
              </Pressable>
            ))}
          </View>
        ) : null}
      </Section>

      <Section title="Attempts">
        {climb.attempts.map((attempt, index) => (
          <View key={attempt.id} style={{ gap: 4, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontWeight: '600', flex: 1 }}>Attempt {index + 1}</Text>
              {climb.attempts.length > 1 ? (
                <Pressable
                  onPress={() => removeAttempt(attempt.id)}
                  style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
                >
                  <Text style={{ color: ui.textMuted, textDecorationLine: 'underline' }}>Remove</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {attemptProgressOptionsForIndex(index).map((opt) => (
                <ToggleChip
                  key={opt.value}
                  label={opt.label}
                  selected={attempt.progress.includes(opt.value)}
                  onPress={() => toggleProgress(attempt.id, opt.value)}
                  paddingHorizontal={8}
                  fontSize={13}
                />
              ))}
            </View>
          </View>
        ))}
        <Button label="Add attempt" variant="secondary" onPress={addAttempt} />
      </Section>

      {onShare ? <Button label="Share climb" variant="ghost" onPress={onShare} /> : null}
    </Card>
  );
}
