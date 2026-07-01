export interface UserPostStats {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalFavorites: number;
}

export interface StatCardConfig {
  key: keyof UserPostStats;
  label: string;
  icon: string;
}
