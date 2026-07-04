import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ClimbAtGlance } from './SessionClimb';
import { WireframeBox, WireframeField, WireframeSection } from './Wireframe';
import type { Location } from '../context/PrototypeContext';
import type { SessionClimb, SessionSort } from '../types/climbingSession';
import { CLIMB_TAG_SUGGESTIONS } from '../types/climbingSession';
import { filterClimbs, sortClimbs } from '../utils/sessionUtils';

export function SessionClimbsList({
  climbs,
  location,
  onEditClimb,
  onShareClimb,
}: {
  climbs: SessionClimb[];
  location?: Location;
  onEditClimb: (climb: SessionClimb) => void;
  onShareClimb?: (climb: SessionClimb) => void;
}) {
  const [sort, setSort] = useState<SessionSort>('order');
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [hideWarmUp, setHideWarmUp] = useState(false);
  const [hideRepeat, setHideRepeat] = useState(false);

  const showSearchFilter = climbs.length > 1;

  const filteredClimbs = useMemo(() => {
    const sorted = sortClimbs(climbs, sort, location?.levels ?? []);
    return filterClimbs(sorted, {
      search: showSearchFilter ? search : undefined,
      difficultyId: filterDifficulty || undefined,
      tag: filterTag || undefined,
      hideWarmUp,
      hideRepeat,
    });
  }, [climbs, sort, location, search, filterDifficulty, filterTag, hideWarmUp, hideRepeat, showSearchFilter]);

  return (
    <WireframeSection title="Climbs">
      {showSearchFilter ? (
        <>
          <WireframeField
            label="Search climbs"
            value={search}
            onChangeText={setSearch}
            placeholder="Name, tag, notes…"
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Text style={{ fontWeight: '600' }}>Sort:</Text>
            {(
              [
                ['order', 'Order added'],
                ['difficulty', 'Difficulty'],
                ['name', 'Name'],
              ] as const
            ).map(([value, label]) => (
              <Pressable key={value} onPress={() => setSort(value)}>
                <Text style={{ fontWeight: sort === value ? '700' : '400' }}>{label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ gap: 4 }}>
            <Text style={{ fontWeight: '600' }}>Filter</Text>
            {location?.levels.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <Pressable onPress={() => setFilterDifficulty('')}>
                  <Text>All difficulties</Text>
                </Pressable>
                {location.levels.map((level) => (
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              <Pressable onPress={() => setFilterTag('')}>
                <Text>All tags</Text>
              </Pressable>
              {CLIMB_TAG_SUGGESTIONS.map((tag) => (
                <Pressable key={tag} onPress={() => setFilterTag(tag)}>
                  <Text style={{ fontWeight: filterTag === tag ? '700' : '400' }}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </>
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
            onPress={() => onEditClimb(climb)}
            onShare={onShareClimb ? () => onShareClimb(climb) : undefined}
          />
        ))
      )}
    </WireframeSection>
  );
}
