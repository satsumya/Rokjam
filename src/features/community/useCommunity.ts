import { useMemo, useState } from 'react';

import { usePrototype } from '../../context/PrototypeContext';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../../utils/sessionUtils';

import type { CommunityTab, CommunityViewProps } from './CommunityView';

function locationMatches(homeName: string, sessionLocation: string) {
  const home = homeName.toLowerCase();
  const loc = sessionLocation.toLowerCase();
  return home.includes('urban climb') && loc.includes('urban climb');
}

export function useCommunity(): CommunityViewProps {
  const { publicSessions, sessions, locations, followedUsers, toggleFollowUser } = usePrototype();
  const [tab, setTab] = useState<CommunityTab>('all');

  const homeLocation = locations.find((l) => l.isHome) ?? locations[0];
  const ownPublic = sessions.filter((s) => s.status === 'completed' && s.isPublic);
  const allPublic = [...publicSessions, ...ownPublic];

  const feed = useMemo(() => {
    let items = [...allPublic];
    if (tab === 'following') {
      items = items.filter((s) => followedUsers.includes(s.ownerUsername));
    }
    if (tab === 'nearby' && homeLocation) {
      items = items
        .filter((s) => locationMatches(homeLocation.name, s.locationName))
        .concat(items.filter((s) => !locationMatches(homeLocation.name, s.locationName)));
    }
    return items.sort((a, b) => b.date.localeCompare(a.date));
  }, [allPublic, tab, followedUsers, homeLocation]);

  return {
    tab,
    feed: feed.map((session) => ({
      session,
      duration: formatDuration(
        computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes),
      ),
      difficultyRange: sessionDifficultyRange(session.climbs, []),
    })),
    allPublicSessions: allPublic,
    followedUsers,
    onTabChange: setTab,
    onToggleFollow: toggleFollowUser,
  };
}
