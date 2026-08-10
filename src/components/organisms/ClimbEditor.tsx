import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '../atoms/Button';
import { CheckboxRow } from '../atoms/CheckboxRow';
import { Chip, RemovableChip } from '../atoms/Chip';
import { Text } from '../atoms/Text';
import { ToggleChip } from '../atoms/ToggleChip';
import { Section } from '../atoms/Section';
import { TextField } from '../atoms/TextField';
import { DifficultyPicker } from '../molecules/DifficultyPicker';
import { parseTagDraft } from '../molecules/TagInput';
import type { Location } from '../../domain/types/profile';
import type { SessionClimb } from '../../types/climbingSession';
import {
  attemptProgressOptionsForIndex,
  ATTEMPT_PROGRESS_OPTIONS,
  CLIMB_TAG_SUGGESTIONS,
  nextAttemptProgress,
} from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { space } from '../../theme/spacing';

type ClimbEditorProps = {
  climb: SessionClimb;
  location?: Location;
  onChange: (patch: Partial<SessionClimb>) => void;
  onShare?: () => void;
};

function ClimbEditorRoot({ style, children }: { style?: object; children: ReactNode }) {
  return <View style={style}>{children}</View>;
}

function ClimbFlagRow({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>{children}</View>;
}

function ClimbTagRow({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>{children}</View>;
}

function ClimbTagComposer({ children }: { children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8], alignItems: 'flex-end' }}>
      {children}
    </View>
  );
}

function ClimbTagComposerField({ children }: { children: ReactNode }) {
  return <View style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>{children}</View>;
}

function ClimbSuggestionRow({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[6] }}>{children}</View>;
}

function ClimbAttemptBlock({ children }: { children: ReactNode }) {
  return <View style={{ gap: space[4], marginBottom: space[8] }}>{children}</View>;
}

function ClimbAttemptHeader({ children }: { children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
      {children}
    </View>
  );
}

function ClimbProgressRow({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[6] }}>{children}</View>;
}

export function ClimbEditor({ climb, location, onChange, onShare }: ClimbEditorProps) {
  const [customTag, setCustomTag] = useState('');

  const toggleTag = (tag: string) => {
    const next = climb.tags.includes(tag)
      ? climb.tags.filter((t) => t !== tag)
      : [...climb.tags, tag];
    onChange({ tags: next });
  };

  const remainingSuggestions = CLIMB_TAG_SUGGESTIONS.filter((tag) => !climb.tags.includes(tag));

  const addCustomTag = () => {
    const next = parseTagDraft(customTag).map((tag) => tag.toLowerCase());
    if (!next.length) return;
    const merged = [...climb.tags];
    for (const tag of next) {
      if (!merged.includes(tag)) merged.push(tag);
    }
    onChange({ tags: merged });
    setCustomTag('');
  };

  const handleCustomTagChange = (value: string) => {
    if (!value.includes(',')) {
      setCustomTag(value);
      return;
    }
    const parts = value.split(',');
    const complete = parts
      .slice(0, -1)
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);
    if (complete.length) {
      const merged = [...climb.tags];
      for (const tag of complete) {
        if (!merged.includes(tag)) merged.push(tag);
      }
      onChange({ tags: merged });
    }
    setCustomTag(parts[parts.length - 1] ?? '');
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
    <ClimbEditorRoot style={{ gap: space[16] }}>
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
          <Text variant="body" color={ui.textMuted}>
            Add a location with levels to pick difficulty.
          </Text>
        )}
        <ClimbFlagRow>
          <CheckboxRow label="Warm-up" checked={climb.isWarmUp} onPress={() => onChange({ isWarmUp: !climb.isWarmUp })} />
          <CheckboxRow label="Repeat" checked={climb.isRepeat} onPress={() => onChange({ isRepeat: !climb.isRepeat })} />
          <CheckboxRow label="Project" checked={climb.isProject} onPress={() => onChange({ isProject: !climb.isProject })} />
        </ClimbFlagRow>
        <TextField
          label="Notes"
          value={climb.notes ?? ''}
          onChangeText={(notes) => onChange({ notes })}
          placeholder="Optional notes"
        />
        <ClimbFlagRow>
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
        </ClimbFlagRow>
      </Section>

      <Section title="Tags">
        {remainingSuggestions.length ? (
          <ClimbSuggestionRow>
            {remainingSuggestions.map((tag) => (
              <Chip key={tag} label={`+ ${tag}`} onPress={() => toggleTag(tag)} />
            ))}
          </ClimbSuggestionRow>
        ) : null}
        <ClimbTagComposer>
          <ClimbTagComposerField>
            <TextField
              value={customTag}
              onChangeText={handleCustomTagChange}
              placeholder="Custom tag"
              accessibilityLabel="Custom tag"
              returnKeyType="done"
              onSubmitEditing={addCustomTag}
            />
          </ClimbTagComposerField>
          <Button
            icon="plus"
            variant="secondary"
            size="medium"
            accessibilityLabel="Add tag"
            onPress={addCustomTag}
          />
        </ClimbTagComposer>
        {climb.tags.length ? (
          <ClimbTagRow>
            {climb.tags.map((tag) => (
              <RemovableChip key={tag} label={tag} onPress={() => toggleTag(tag)} />
            ))}
          </ClimbTagRow>
        ) : null}
      </Section>

      <Section title="Attempts">
        {climb.attempts.map((attempt, index) => (
          <ClimbAttemptBlock key={attempt.id}>
            <ClimbAttemptHeader>
              <Text variant="body" weight="bold" style={{ flex: 1, minWidth: 0 }}>
                Attempt {index + 1}
              </Text>
              {climb.attempts.length > 1 ? (
                <Pressable
                  onPress={() => removeAttempt(attempt.id)}
                  style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
                >
                  <Text variant="bodySmall" color={ui.textMuted} style={{ textDecorationLine: 'underline' }}>
                    Remove
                  </Text>
                </Pressable>
              ) : null}
            </ClimbAttemptHeader>
            <ClimbProgressRow>
              {attemptProgressOptionsForIndex(index).map((opt) => (
                <ToggleChip
                  key={opt.value}
                  label={opt.label}
                  selected={attempt.progress.includes(opt.value)}
                  onPress={() => toggleProgress(attempt.id, opt.value)}
                  paddingHorizontal={space[8]}
                />
              ))}
            </ClimbProgressRow>
          </ClimbAttemptBlock>
        ))}
        <Button label="Add attempt" variant="secondary" onPress={addAttempt} />
      </Section>

      {onShare ? <Button label="Share climb" variant="ghost" onPress={onShare} /> : null}
    </ClimbEditorRoot>
  );
}
