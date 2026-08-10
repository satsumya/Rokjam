import { useAppData } from '../AppDataProvider';
import type { CommunityRepository } from '../../domain/ports';

export function useCommunity(): CommunityRepository {
  const data = useAppData();
  return {
    publicSessions: data.publicSessions,
    followedUsers: data.followedUsers,
    toggleFollowUser: data.toggleFollowUser,
  };
}
