import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import {
  WireframeBox,
  WireframeButton,
  WireframeField,
  WireframeSection,
} from './Wireframe';
import type { Location } from '../context/PrototypeContext';
import type { SessionClimb } from '../types/climbingSession';
import {
  attemptProgressOptionsForIndex,
  ATTEMPT_PROGRESS_OPTIONS,
  bestAttemptProgress,
  CLIMB_TAG_SUGGESTIONS,
  formatAttemptProgress,
  nextAttemptProgress,
} from '../types/climbingSession';
import { formatSessionDate } from '../utils/sessionUtils';

type DifficultyLevel = Location['levels'][number];

function DifficultyQuickPick({
  levels,
  selectedLevelId,
  onSelect,
}: {
  levels: DifficultyLevel[];
  selectedLevelId?: string;
  onSelect: (level: DifficultyLevel) => void;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontWeight: '600', fontSize: 13 }}>
        {selectedLevelId ? 'Difficulty' : 'Add difficulty'}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {levels.map((level) => (
          <Pressable
            key={level.id}
            onPress={() => onSelect(level)}
            style={{
              borderWidth: 1,
              borderColor: selectedLevelId === level.id ? '#111' : '#CCC',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: level.color,
              }}
            />
            <Text>{level.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

type ClimbEditorProps = {
  climb: SessionClimb;
  location?: Location;
  onChange: (patch: Partial<SessionClimb>) => void;
  onShare?: () => void;
};

export function ClimbAtGlance({
  climb,
  location,
  onPress,
  onShare,
  onRemove,
  onDifficultyChange,
}: {
  climb: SessionClimb;
  location?: Location;
  onPress?: () => void;
  onShare?: () => void;
  onRemove?: () => void;
  onDifficultyChange?: (level: DifficultyLevel) => void;
}) {
  const labels: string[] = [];
  if (climb.isWarmUp) labels.push('Warm-up');
  if (climb.isProject) labels.push('Project');
  if (!climb.isRepeat) labels.push('New');

  const attemptSummary = climb.attempts.length
    ? `Attempts (${climb.attempts.length}): ${bestAttemptProgress(climb.attempts)}`
    : 'No attempts yet';

  const showDifficultyPicker = Boolean(location?.levels.length && onDifficultyChange);

  const body = (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        {onPress ? (
          <Pressable style={{ flex: 1 }} onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {climb.levelColor ? (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: climb.levelColor,
                  }}
                />
              ) : null}
              <Text style={{ fontWeight: '700', flex: 1 }}>{climb.name || 'Unnamed climb'}</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {climb.hasImage ? <Text accessibilityLabel="Photo">📷</Text> : null}
                {climb.hasVideo ? <Text accessibilityLabel="Video">🎥</Text> : null}
              </View>
            </View>
          </Pressable>
        ) : (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {climb.levelColor ? (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: climb.levelColor,
                }}
              />
            ) : null}
            <Text style={{ fontWeight: '700', flex: 1 }}>{climb.name || 'Unnamed climb'}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {climb.hasImage ? <Text accessibilityLabel="Photo">📷</Text> : null}
              {climb.hasVideo ? <Text accessibilityLabel="Video">🎥</Text> : null}
            </View>
          </View>
        )}
        {onRemove ? (
          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={{ color: '#C0392B', fontWeight: '600', fontSize: 14 }}>Remove</Text>
          </Pressable>
        ) : null}
      </View>

      {showDifficultyPicker ? (
        <DifficultyQuickPick
          levels={location!.levels}
          selectedLevelId={climb.levelId}
          onSelect={onDifficultyChange!}
        />
      ) : climb.levelName ? (
        <Text>{climb.levelName}</Text>
      ) : null}

      {onPress ? (
        <Pressable onPress={onPress}>
          <Text>{attemptSummary}</Text>
          {climb.tags.length ? <Text>Tags: {climb.tags.join(', ')}</Text> : null}
          {labels.length ? <Text>{labels.join(' · ')}</Text> : null}
        </Pressable>
      ) : (
        <>
          <Text>{attemptSummary}</Text>
          {climb.tags.length ? <Text>Tags: {climb.tags.join(', ')}</Text> : null}
          {labels.length ? <Text>{labels.join(' · ')}</Text> : null}
        </>
      )}

      {onShare ? (
        <WireframeButton label="Share climb" variant="ghost" onPress={onShare} />
      ) : null}
    </>
  );

  return <WireframeBox>{body}</WireframeBox>;
}

export function ClimbEditor({ climb, location, onChange, onShare }: ClimbEditorProps) {
  const [customTag, setCustomTag] = useState('');

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
    <WireframeBox>
      <WireframeSection title="Climb details">
        <WireframeField
          label="Name or wall name"
          value={climb.name ?? ''}
          onChangeText={(name) => onChange({ name })}
          placeholder="e.g. Comp wall dyno"
        />
        {location?.levels.length ? (
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: '600' }}>Difficulty</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {location.levels.map((level) => (
                <Pressable
                  key={level.id}
                  onPress={() =>
                    onChange({
                      levelId: level.id,
                      levelName: level.name,
                      levelColor: level.color,
                    })
                  }
                  style={{
                    borderWidth: 1,
                    borderColor: climb.levelId === level.id ? '#111' : '#CCC',
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: level.color,
                    }}
                  />
                  <Text>{level.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Text style={{ color: '#666' }}>Add a location with levels to pick difficulty.</Text>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Pressable onPress={() => onChange({ isWarmUp: !climb.isWarmUp })}>
            <Text>{climb.isWarmUp ? '☑' : '☐'} Warm-up</Text>
          </Pressable>
          <Pressable onPress={() => onChange({ isRepeat: !climb.isRepeat })}>
            <Text>{climb.isRepeat ? '☑' : '☐'} Repeat</Text>
          </Pressable>
          <Pressable onPress={() => onChange({ isProject: !climb.isProject })}>
            <Text>{climb.isProject ? '☑' : '☐'} Project</Text>
          </Pressable>
        </View>
        <WireframeField
          label="Notes"
          value={climb.notes ?? ''}
          onChangeText={(notes) => onChange({ notes })}
          placeholder="Optional notes"
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <WireframeButton
            label={climb.hasImage ? 'Replace image' : 'Add image'}
            variant="secondary"
            onPress={() => onChange({ hasImage: true })}
          />
          <WireframeButton
            label={climb.hasVideo ? 'Replace video' : 'Add video'}
            variant="secondary"
            onPress={() => onChange({ hasVideo: true })}
          />
        </View>
      </WireframeSection>

      <WireframeSection title="Tags">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {CLIMB_TAG_SUGGESTIONS.map((tag) => (
            <Pressable key={tag} onPress={() => toggleTag(tag)}>
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: climb.tags.includes(tag) ? '#111' : '#CCC',
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                {tag}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TextInput
            value={customTag}
            onChangeText={setCustomTag}
            placeholder="Custom tag"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#CCC',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
          />
          <WireframeButton label="Add tag" variant="secondary" onPress={addCustomTag} />
        </View>
        {climb.tags.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {climb.tags.map((tag) => (
              <Pressable key={tag} onPress={() => toggleTag(tag)}>
                <Text style={{ textDecorationLine: 'underline' }}>{tag} ×</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </WireframeSection>

      <WireframeSection title="Attempts">
        {climb.attempts.map((attempt, index) => (
          <View key={attempt.id} style={{ gap: 4, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontWeight: '600', flex: 1 }}>Attempt {index + 1}</Text>
              {climb.attempts.length > 1 ? (
                <Pressable onPress={() => removeAttempt(attempt.id)}>
                  <Text style={{ color: '#666', textDecorationLine: 'underline' }}>Remove</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {attemptProgressOptionsForIndex(index).map(
                (opt) => (
                  <Pressable key={opt.value} onPress={() => toggleProgress(attempt.id, opt.value)}>
                    <Text
                      style={{
                        borderWidth: 1,
                        borderColor: attempt.progress.includes(opt.value) ? '#111' : '#CCC',
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        fontSize: 13,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>
        ))}
        <WireframeButton label="Add attempt" variant="secondary" onPress={addAttempt} />
      </WireframeSection>

      {onShare ? (
        <WireframeButton label="Share climb" variant="ghost" onPress={onShare} />
      ) : null}
    </WireframeBox>
  );
}

export function ShareMockBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <WireframeBox>
      <Text style={{ fontWeight: '700' }}>Share link copied (prototype mock)</Text>
    </WireframeBox>
  );
}

export function SessionRow({
  date,
  duration,
  climbCount,
  difficultyRange,
  location,
  onPress,
}: {
  date: string;
  duration: string;
  climbCount: number;
  difficultyRange: string;
  location: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>{formatSessionDate(date)}</Text>
        <Text>{location}</Text>
        <Text>
          {duration} · {climbCount} climb{climbCount === 1 ? '' : 's'} · {difficultyRange}
        </Text>
      </WireframeBox>
    </Pressable>
  );
}
