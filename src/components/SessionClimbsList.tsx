import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ClimbAtGlance } from './SessionClimb';
import { WireframeBox, WireframeSection } from './Wireframe';
import type { Location } from '../context/PrototypeContext';
import type { SessionClimb, SessionSort } from '../types/climbingSession';
import { filterClimbs, sortClimbs } from '../utils/sessionUtils';

const SORT_OPTIONS: { value: SessionSort; label: string }[] = [
  { value: 'order', label: 'Newest first' },
  { value: 'order-oldest', label: 'Oldest first' },
  { value: 'difficulty', label: 'Difficulty ↑' },
  { value: 'difficulty-desc', label: 'Difficulty ↓' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

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
    <WireframeSection title="Climbs">
      {showSortFilter ? (
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Text style={{ fontWeight: '600' }}>Sort:</Text>
            {SORT_OPTIONS.map(({ value, label }) => (
              <Pressable key={value} onPress={() => setSort(value)}>
                <Text style={{ fontWeight: sort === value ? '700' : '400' }}>{label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ gap: 4 }}>
            <Text style={{ fontWeight: '600' }}>Filter</Text>
            {showDifficultyFilter ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <Pressable onPress={() => setFilterDifficulty('')}>
                  <Text style={{ fontWeight: !filterDifficulty ? '700' : '400' }}>All difficulties</Text>
                </Pressable>
                {filterableLevels.map((level) => (
                  <Pressable key={level.id} onPress={() => setFilterDifficulty(level.id)}>
                    <Text style={{ fontWeight: filterDifficulty === level.id ? '700' : '400' }}>
                      {level.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <Pressable onPress={() => setHideWarmUp((v) => !v)}>
              <Text>{hideWarmUp ? '☑' : '☐'} Hide warm-up climbs</Text>
            </Pressable>
            <Pressable onPress={() => setHideRepeat((v) => !v)}>
              <Text>{hideRepeat ? '☑' : '☐'} Hide repeat climbs</Text>
            </Pressable>
            {showTagFilter ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <Pressable onPress={() => setFilterTag('')}>
                  <Text style={{ fontWeight: !filterTag ? '700' : '400' }}>All tags</Text>
                </Pressable>
                {usedTags.map((tag) => (
                  <Pressable key={tag} onPress={() => setFilterTag(tag)}>
                    <Text style={{ fontWeight: filterTag === tag ? '700' : '400' }}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      ) : null}

      {filteredClimbs.length === 0 ? (
        <WireframeBox>
          <Text>No climbs yet. Tap Add climb to log your first climb.</Text>
        </WireframeBox>
      ) : (
        filteredClimbs.map((climb) => (
          <ClimbAtGlance
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
    </WireframeSection>
  );
}
