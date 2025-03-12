export interface UserMetadata {
  // username?: string;
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
  // Uncomment or add additional fields as needed:
  // full_name?: string;
  // description?: string;
  // name?: string;
  // avatar?: string;
  // role?: string;
  // joinDate?: string;
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
}