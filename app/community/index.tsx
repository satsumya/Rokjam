import { CommunityView } from '../../src/features/community/CommunityView';
import { useCommunity } from '../../src/features/community/useCommunity';

export default function CommunityScreen() {
  return <CommunityView {...useCommunity()} />;
}
