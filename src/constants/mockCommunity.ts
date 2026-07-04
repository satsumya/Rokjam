export type CommunityPost = {
  id: string;
  username: string;
  avatar: string;
  location: string;
  levelLabel: string;
  levelColor: string;
  outcome: string;
  routeName?: string;
  timeAgo: string;
  isFollowing: boolean;
};

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    username: 'alex_climber',
    avatar: '🪨',
    location: 'Urban Climb West End',
    levelLabel: 'Blue',
    levelColor: '#4A90D9',
    outcome: 'Send',
    routeName: 'Corner crack',
    timeAgo: '2h ago',
    isFollowing: true,
  },
  {
    id: 'post-2',
    username: 'thegoat',
    avatar: '🗿',
    location: 'Kangaroo Point Cliffs',
    levelLabel: 'Purple',
    levelColor: '#9B59B6',
    outcome: 'Flash',
    routeName: 'River wall traverse',
    timeAgo: '5h ago',
    isFollowing: false,
  },
  {
    id: 'post-3',
    username: 'crimp_queen',
    avatar: '💎',
    location: 'Urban Climb West End',
    levelLabel: 'Orange',
    levelColor: '#E67E22',
    outcome: 'Working',
    timeAgo: '1d ago',
    isFollowing: true,
  },
];
