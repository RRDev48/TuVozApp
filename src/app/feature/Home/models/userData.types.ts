// Interface para el hook useUserData
export interface UseUserDataReturn {
  userName: string | null;
  loading: boolean;
  error: any;
  refreshUser: () => Promise<void>;
}
