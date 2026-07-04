import { Pressable, Text, View } from 'react-native';

import {
  WireframeBox,
  WireframeButton,
  WireframeField,
  WireframeSection,
} from './Wireframe';
import type { Location } from '../context/PrototypeContext';
import type { AttemptProgress, SessionClimb } from '../types/climbingSession';
import { ATTEMPT_PROGRESS_OPTIONS, CLIMB_TAG_SUGGESTIONS } from '../types/climbingSession';
import { climbSummary, formatSessionDate } from '../utils/sessionUtils';

type ClimbEditorProps = {
  climb: SessionClimb;
  location?: Location;
  onChange: (patch: Partial<SessionClimb>) => void;
  onSave: () => void;
  onCancel: () => void;
  onShare?: () => void;
};

export function ClimbAtGlance({
  climb,
  onPress,
  onShare,
}: {
  climb: SessionClimb;
  onPress?: () => void;
  onShare?: () => void;
}) {
  const content = (
    <>
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
        {climb.isWarmUp ? <Text>🔥</Text> : null}
        {!climb.isRepeat ? <Text>✨</Text> : null}
      </View>
      <Text>{climbSummary(climb)}</Text>
      {climb.tags.length ? <Text>Tags: {climb.tags.join(', ')}</Text> : null}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {climb.hasImage ? <Text>📷</Text> : null}
        {climb.hasVideo ? <Text>🎥</Text> : null}
      </View>
      {onShare ? (
        <WireframeButton label="Share climb" variant="ghost" onPress={onShare} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <WireframeBox>{content}</WireframeBox>
      </Pressable>
    );
  }
  return <WireframeBox>{content}</WireframeBox>;
}

export function ClimbEditor({ climb, location, onChange, onSave, onCancel, onShare }: ClimbEditorProps) {
  const toggleTag = (tag: string) => {
    const next = climb.tags.includes(tag)
      ? climb.tags.filter((t) => t !== tag)
      : [...climb.tags, tag];
    onChange({ tags: next });
  };

  const toggleProgress = (value: AttemptProgress) => {
    const attempt = climb.attempts[0] ?? { id: `${Date.now()}`, progress: [] as AttemptProgress[] };
    const progress = attempt.progress.includes(value)
      ? attempt.progress.filter((p) => p !== value)
      : [...attempt.progress, value];
    onChange({ attempts: [{ ...attempt, progress }] });
  };

  const addAttempt = () => {
    onChange({
      attempts: [
        ...climb.attempts,
        { id: `${Date.now()}`, progress: ['working'] as AttemptProgress[] },
      ],
    });
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
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable onPress={() => onChange({ isWarmUp: !climb.isWarmUp })}>
            <Text>{climb.isWarmUp ? '☑' : '☐'} Warm-up</Text>
          </Pressable>
          <Pressable onPress={() => onChange({ isRepeat: !climb.isRepeat })}>
            <Text>{climb.isRepeat ? '☑' : '☐'} Repeat</Text>
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
      </WireframeSection>

      <WireframeSection title="Attempts">
        {climb.attempts.map((attempt, index) => (
          <View key={attempt.id} style={{ gap: 4, marginBottom: 8 }}>
            <Text style={{ fontWeight: '600' }}>Attempt {index + 1}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {ATTEMPT_PROGRESS_OPTIONS.map((opt) => (
                <Pressable key={opt.value} onPress={() => toggleProgress(opt.value)}>
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
              ))}
            </View>
          </View>
        ))}
        <WireframeButton label="Add attempt" variant="secondary" onPress={addAttempt} />
      </WireframeSection>

      <View style={{ gap: 8 }}>
        <WireframeButton label="Save climb" onPress={onSave} />
        <WireframeButton label="Cancel" variant="ghost" onPress={onCancel} />
        {onShare ? (
          <WireframeButton label="Share climb" variant="ghost" onPress={onShare} />
        ) : null}
      </View>
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
