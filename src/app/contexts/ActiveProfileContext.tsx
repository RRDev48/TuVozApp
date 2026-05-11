import { supabase } from "@/src/lib/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const STORAGE_KEY = "@active_profile";

type ActiveProfileData = {
  displayName: string | null;
  avatarUrl: string | null;
};

type ActiveProfileContextType = {
  displayName: string | null;
  avatarUrl: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  update: (data: Partial<ActiveProfileData>) => Promise<void>;
  clear: () => Promise<void>;
};

const ActiveProfileContext = createContext<
  ActiveProfileContextType | undefined
>(undefined);

export const useActiveProfile = (): ActiveProfileContextType => {
  const ctx = useContext(ActiveProfileContext);
  if (!ctx) {
    throw new Error(
      "useActiveProfile debe usarse dentro de ActiveProfileProvider",
    );
  }
  return ctx;
};

async function fetchProfileFromSupabase(): Promise<ActiveProfileData | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: userData } = await supabase.auth.getUser();

  let avatarUrl: string | null = null;
  if (userData.user?.user_metadata?.avatar_url) {
    avatarUrl = userData.user.user_metadata.avatar_url;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("profiles(display_name, avatar_url)")
    .eq("user_id", user.id)
    .eq("is_owner", true)
    .maybeSingle();

  if (error && error.code !== "PGRST116") return null;

  let displayName: string | null = null;
  let profileAvatarUrl: string | null = null;

  if (data) {
    const profile = (
      Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
    ) as
      | { display_name: string | null; avatar_url: string | null }
      | null
      | undefined;

    if (profile) {
      displayName = profile.display_name ?? null;
      profileAvatarUrl = profile.avatar_url ?? null;
    }
  }

  return {
    displayName: displayName,
    avatarUrl: profileAvatarUrl || avatarUrl,
  };
}

export const ActiveProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFromStorage = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const cached: ActiveProfileData = JSON.parse(raw);
        setDisplayName(cached.displayName);
        setAvatarUrl(cached.avatarUrl);
      }
    } catch {
      // storage vacío o corrupto, se ignora
    }
  }, []);

  const persistToStorage = useCallback(async (data: ActiveProfileData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // no crítico
    }
  }, []);

  const refresh = useCallback(async () => {
    const remote = await fetchProfileFromSupabase();
    if (remote) {
      setDisplayName(remote.displayName);
      setAvatarUrl(remote.avatarUrl);
      await persistToStorage(remote);
    }
  }, [persistToStorage]);

  const update = useCallback(
    async (data: Partial<ActiveProfileData>) => {
      const next: ActiveProfileData = {
        displayName:
          data.displayName !== undefined ? data.displayName : displayName,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : avatarUrl,
      };
      setDisplayName(next.displayName);
      setAvatarUrl(next.avatarUrl);
      await persistToStorage(next);
    },
    [displayName, avatarUrl, persistToStorage],
  );

  const clear = useCallback(async () => {
    setDisplayName(null);
    setAvatarUrl(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // no crítico
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      // 1. Verificar si hay sesión activa antes de cargar nada
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        await clear();
        setLoading(false);
        return;
      }

      await loadFromStorage(); // instantáneo → sin parpadeo
      setLoading(false);
      void refresh(); // background sync con Supabase
    };

    void init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        void refresh();
      }
      if (event === "SIGNED_OUT") {
        await clear();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ActiveProfileContext.Provider
      value={{ displayName, avatarUrl, loading, refresh, update, clear }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
};
