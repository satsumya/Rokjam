import { Pressable, Text, View } from 'react-native';

import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { LevelDot } from '../atoms/LevelDot';
import { DifficultyPicker } from './DifficultyPicker';
import type { Location } from '../../context/PrototypeContext';
import type { SessionClimb } from '../../types/climbingSession';
import { bestAttemptProgress } from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';

type DifficultyLevel = Location['levels'][number];

/** Condensed read-only view of a climb, used in session lists. */
export function ClimbCard({
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

  const heading = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {climb.levelColor ? <LevelDot color={climb.levelColor} /> : null}
      <Text style={{ fontWeight: '700', flex: 1 }}>{climb.name || 'Unnamed climb'}</Text>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {climb.hasImage ? <Icon name="camera" size="xs" color={ui.textMuted} title="Photo" /> : null}
        {climb.hasVideo ? <Icon name="video" size="xs" color={ui.textMuted} title="Video" /> : null}
      </View>
    </View>
  );

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        {onPress ? (
          <Pressable
            style={(state) => [{ flex: 1, borderRadius: 4 }, interactionStyle(state)]}
            onPress={onPress}
          >
            {heading}
          </Pressable>
        ) : (
          <View style={{ flex: 1 }}>{heading}</View>
        )}
        {onRemove ? (
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
          >
            <Text style={{ color: ui.danger, fontWeight: '600', fontSize: 14 }}>Remove</Text>
          </Pressable>
        ) : null}
      </View>

      {showDifficultyPicker ? (
        <DifficultyPicker
          levels={location!.levels}
          selectedLevelId={climb.levelId}
          onSelect={onDifficultyChange!}
          title={climb.levelId ? 'Difficulty' : 'Add difficulty'}
          compact
        />
      ) : climb.levelName ? (
        <Text>{climb.levelName}</Text>
      ) : null}

      {onPress ? (
        <Pressable onPress={onPress} style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}>
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

      {onShare ? <Button label="Share climb" variant="ghost" onPress={onShare} /> : null}
    </Card>
  );
}
