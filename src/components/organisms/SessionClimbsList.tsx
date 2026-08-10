import { useMemo, useState } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

import { CheckboxRow } from '../atoms/CheckboxRow';
import { Section } from '../atoms/Section';
import { Text } from '../atoms/Text';
import { ClimbCard } from '../molecules/ClimbCard';
import type { Location } from '../../domain/types/profile';
import type { SessionClimb, SessionSort } from '../../types/climbingSession';
import { filterClimbs, sortClimbs } from '../../utils/sessionUtils';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { space } from '../../theme/spacing';

const SORT_OPTIONS: { value: SessionSort; label: string }[] = [
  { value: 'order', label: 'Newest first' },
  { value: 'order-oldest', label: 'Oldest first' },
  { value: 'difficulty', label: 'Difficulty ↑' },
  { value: 'difficulty-desc', label: 'Difficulty ↓' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

function ClimbsSortFilterBlock({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ClimbsSortRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ClimbsFilterBlock({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function ClimbsFilterChipRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

export function SessionClimbsList({
  climbs,
  location,
  onEditClimb,
  onShareClimb,
  onRemoveClimb,
  onDifficultyChange,
}: {
  climbs: SessionClimb[];
  location?: Location;
  onEditClimb: (climb: SessionClimb) => void;
  onShareClimb?: (climb: SessionClimb) => void;
  onRemoveClimb?: (climb: SessionClimb) => void;
  onDifficultyChange?: (climb: SessionClimb, level: Location['levels'][number]) => void;
}) {
  const [sort, setSort] = useState<SessionSort>('order');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [hideWarmUp, setHideWarmUp] = useState(false);
  const [hideRepeat, setHideRepeat] = useState(false);

  const showSortFilter = climbs.length > 1;

  const climbsWithDifficulty = useMemo(
    () => climbs.filter((c) => Boolean(c.levelId)),
    [climbs],
  );
  const showDifficultyFilter = Boolean(location?.levels.length && climbsWithDifficulty.length > 0);
  const usedLevelIds = useMemo(
    () => new Set(climbsWithDifficulty.map((c) => c.levelId)),
    [climbsWithDifficulty],
  );
  const filterableLevels = useMemo(
    () => (location?.levels ?? []).filter((level) => usedLevelIds.has(level.id)),
    [location, usedLevelIds],
  );

  const usedTags = useMemo(() => {
    const tags = new Set<string>();
    climbs.forEach((climb) => climb.tags.forEach((tag) => tags.add(tag)));
    return [...tags].sort();
  }, [climbs]);
  const showTagFilter = usedTags.length > 0;

  const filteredClimbs = useMemo(() => {
    const sorted = sortClimbs(climbs, sort, location?.levels ?? []);
    return filterClimbs(sorted, {
      difficultyId: filterDifficulty || undefined,
      tag: filterTag || undefined,
      hideWarmUp,
      hideRepeat,
    });
  }, [climbs, sort, location, filterDifficulty, filterTag, hideWarmUp, hideRepeat]);

  return (
    <Section title="Climbs">
      {showSortFilter ? (
        <ClimbsSortFilterBlock style={{ gap: space[8] }}>
          <ClimbsSortRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[8] }}>
            <Text variant="body" weight="bold">
              Sort:
            </Text>
            {SORT_OPTIONS.map(({ value, label }) => (
              <Pressable
                key={value}
                onPress={() => setSort(value)}
                style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
              >
                <Text variant="body" weight={sort === value ? 'bold' : 'regular'}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </ClimbsSortRow>
          <ClimbsFilterBlock style={{ gap: space[4] }}>
            <Text variant="body" weight="bold">
              Filter
            </Text>
            {showDifficultyFilter ? (
              <ClimbsFilterChipRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[6] }}>
                <Pressable
                  onPress={() => setFilterDifficulty('')}
                  style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
                >
                  <Text variant="body" weight={!filterDifficulty ? 'bold' : 'regular'}>
                    All difficulties
                  </Text>
                </Pressable>
                {filterableLevels.map((level) => (
                  <Pressable
                    key={level.id}
                    onPress={() => setFilterDifficulty(level.id)}
                    style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
                  >
                    <Text variant="body" weight={filterDifficulty === level.id ? 'bold' : 'regular'}>
                      {level.name}
                    </Text>
                  </Pressable>
                ))}
              </ClimbsFilterChipRow>
            ) : null}
            <CheckboxRow
              label="Hide warm-up climbs"
              checked={hideWarmUp}
              onPress={() => setHideWarmUp((v) => !v)}
            />
            <CheckboxRow
              label="Hide repeat climbs"
              checked={hideRepeat}
              onPress={() => setHideRepeat((v) => !v)}
            />
            {showTagFilter ? (
              <ClimbsFilterChipRow style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[6] }}>
                <Pressable
                  onPress={() => setFilterTag('')}
                  style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
                >
                  <Text variant="body" weight={!filterTag ? 'bold' : 'regular'}>
                    All tags
                  </Text>
                </Pressable>
                {usedTags.map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => setFilterTag(tag)}
                    style={(state) => [{ borderRadius: 4 }, interactionStyle(state)]}
                  >
                    <Text variant="body" weight={filterTag === tag ? 'bold' : 'regular'}>
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </ClimbsFilterChipRow>
            ) : null}
          </ClimbsFilterBlock>
        </ClimbsSortFilterBlock>
      ) : null}

      {filteredClimbs.length === 0 ? (
        <Text variant="body" color={ui.textMuted}>
          No climbs yet. Tap + to log your first climb.
        </Text>
      ) : (
        filteredClimbs.map((climb) => (
          <ClimbCard
            key={climb.id}
            climb={climb}
            location={location}
            onPress={() => onEditClimb(climb)}
            onShare={onShareClimb ? () => onShareClimb(climb) : undefined}
            onRemove={onRemoveClimb ? () => onRemoveClimb(climb) : undefined}
            onDifficultyChange={
              onDifficultyChange
                ? (level) => onDifficultyChange(climb, level)
                : undefined
            }
          />
        ))
      )}
    </Section>
  );
}
