/**
 * Database types for TuVoz App
 * Reflects the current Supabase schema with users, profiles, and user_profiles tables
 */

export type UserRole =
  | "self"
  | "familiar"
  | "maestra_integradora"
  | "personal_medico"
  | "acompanante_terapeutico";

/**
 * User table - represents an authenticated user
 */
export interface User {
  id: string; // UUID - references auth.users(id)
  full_name: string;
  role: UserRole;
  email: string;
  created_at: string; // timestamptz
}

/**
 * Profile table - represents a profile (can be shared among users)
 */
export interface Profile {
  id: string; // UUID
  full_name: string;
  age: number | null;
  avatar_url: string | null;
  created_at: string; // timestamptz
}

/**
 * User-Profile relationship table - links users to profiles
 */
export interface UserProfile {
  user_id: string; // UUID - references users(id)
  profile_id: string; // UUID - references profiles(id)
  is_owner: boolean; // indicates if user is the owner of the profile
  created_at: string; // timestamptz
}

/**
 * Extended user with profile information
 */
export interface UserWithProfiles extends User {
  profiles: (Profile & { is_owner: boolean })[];
}

/**
 * Profile with owner information
 */
export interface ProfileWithUsers extends Profile {
  users: (User & { is_owner: boolean })[];
}

/**
 * Insert types for creating new records
 */
export type UserInsert = Omit<User, "id" | "created_at"> & {
  id: string; // Must match auth.users.id
};

export type ProfileInsert = Omit<Profile, "id" | "created_at">;

export type UserProfileInsert = Omit<UserProfile, "created_at">;
