export interface UserMetadata {
  name?: string;
  avatar_url?: string;
  role?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  description: string;
  name?: string;
  avatar: string;
  role: string;
  created_at: string;
  joinDate?: string;
  user_metadata: UserMetadata;
}
