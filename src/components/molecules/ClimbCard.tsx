import { Pressable, View } from 'react-native';

import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { LevelDot } from '../atoms/LevelDot';
import { Text } from '../atoms/Text';
import { DifficultyPicker } from './DifficultyPicker';
import type { Location } from '../../context/PrototypeContext';
import type { SessionClimb } from '../../types/climbingSession';
import { bestAttemptProgress } from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { space } from '../../theme/spacing';

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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[8] }}>
      {climb.levelColor ? <LevelDot color={climb.levelColor} /> : null}
      <Text variant="body" weight="bold" style={{ flex: 1, minWidth: 0 }}>
        {climb.name || 'Unnamed climb'}
      </Text>
      <View style={{ flexDirection: 'row', gap: space[4], flexShrink: 0 }}>
        {climb.hasImage ? <Icon name="camera" size="xs" color={ui.textMuted} title="Photo" /> : null}
        {climb.hasVideo ? <Icon name="video" size="xs" color={ui.textMuted} title="Video" /> : null}
      </View>
    </View>
  );

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space[8], flexWrap: 'wrap' }}>
        {onPress ? (
          <Pressable
            style={(state) => [{ flex: 1, minWidth: 0, borderRadius: 4 }, interactionStyle(state)]}
            onPress={onPress}
          >
            {heading}
          </Pressable>
        ) : (
          <View style={{ flex: 1, minWidth: 0 }}>{heading}</View>
        )}
        {onRemove ? (
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            style={(state) => [{ flexShrink: 0, borderRadius: 4 }, interactionStyle(state)]}
          >
            <Text variant="bodySmall" weight="bold" color={ui.danger}>
              Remove
            </Text>
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
        <Text variant="body">{climb.levelName}</Text>
      ) : null}

      {onPress ? (
        <Pressable onPress={onPress} style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}>
          <Text variant="body">{attemptSummary}</Text>
          {climb.tags.length ? <Text variant="body">Tags: {climb.tags.join(', ')}</Text> : null}
          {labels.length ? <Text variant="body">{labels.join(' · ')}</Text> : null}
        </Pressable>
      ) : (
        <>
          <Text variant="body">{attemptSummary}</Text>
          {climb.tags.length ? <Text variant="body">Tags: {climb.tags.join(', ')}</Text> : null}
          {labels.length ? <Text variant="body">{labels.join(' · ')}</Text> : null}
        </>
      )}

      {onShare ? <Button label="Share climb" variant="ghost" onPress={onShare} /> : null}
    </Card>
  );
}
