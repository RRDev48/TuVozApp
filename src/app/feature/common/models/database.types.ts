export type UserRole =
  | "self"
  | "familiar"
  | "maestra_integradora"
  | "personal_medico"
  | "acompanante_terapeutico";

export interface User {
  id: string;
  full_name: string;
  role: UserRole;
  email: string;
  created_at: string;
}
export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  email: string | null;
  auth_user_id: string | null;
  owner_user_id: string | null;
}
export interface UserProfile {
  user_id: string;
  profile_id: string;
  is_owner: boolean;
  created_at: string;
}

export interface UserWithProfiles extends User {
  profiles: (Profile & { is_owner: boolean })[];
}

export interface ProfileWithUsers extends Profile {
  users: (User & { is_owner: boolean })[];
}

export type UserInsert = Omit<User, "id" | "created_at"> & {
  id: string;
};

export type ProfileInsert = Omit<Profile, "id" | "created_at">;

export type UserProfileInsert = Omit<UserProfile, "created_at">;
