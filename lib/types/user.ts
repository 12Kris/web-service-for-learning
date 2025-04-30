export interface UserMetadata {
  full_name?: string;
  displayName?: string;
  website?: string;
  bio?: string;
  location?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: UserMetadata;
}

export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  bio?: string;
  location?: string;
  email?: string;
  total_points?: string;
}
