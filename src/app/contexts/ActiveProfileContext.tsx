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
  id: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

type ActiveProfileContextType = {
  id: string | null;
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

async function fetchProfileFromSupabase(targetProfileId?: string | null): Promise<ActiveProfileData | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  let query = supabase
    .from("user_profiles")
    .select("profile_id, profiles(display_name, avatar_url)")
    .eq("user_id", user.id);

  if (targetProfileId) {
    query = query.eq("profile_id", targetProfileId);
  } else {
    query = query.eq("is_owner", true);
  }

  const { data: rows, error } = await query.limit(1);

  if (error || !rows || rows.length === 0) return null;
  const data = rows[0];

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
    id: data?.profile_id ?? null,
    displayName: displayName,
    avatarUrl: profileAvatarUrl,
  };
}

export const ActiveProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [id, setId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFromStorage = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const cached: ActiveProfileData = JSON.parse(raw);
        setId(cached.id);
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
    const remote = await fetchProfileFromSupabase(id);
    if (remote) {
      setId(remote.id);
      setDisplayName(remote.displayName);
      setAvatarUrl(remote.avatarUrl);
      await persistToStorage(remote);
    }
  }, [id, persistToStorage]);

  const update = useCallback(
    async (data: Partial<ActiveProfileData>) => {
      const next: ActiveProfileData = {
        id: data.id !== undefined ? data.id : id,
        displayName:
          data.displayName !== undefined ? data.displayName : displayName,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : avatarUrl,
      };
      setId(next.id);
      setDisplayName(next.displayName);
      setAvatarUrl(next.avatarUrl);
      await persistToStorage(next);
    },
    [id, displayName, avatarUrl, persistToStorage],
  );

  const clear = useCallback(async () => {
    setId(null);
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
      value={{ id, displayName, avatarUrl, loading, refresh, update, clear }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
};
