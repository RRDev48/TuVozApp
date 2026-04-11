import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useCurrentUserProfile } from "../../ajustes/hooks/useCurrentUserProfile";
import { expresateService } from "../services/expresate.Service";

const GUEST_FAVORITES_KEY = "@tuVoz:guest_favorites";

export const useFavoritePictograms = () => {
  const { profileId, loading: profileLoading } = useCurrentUserProfile();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (profileLoading) return;

    try {
      const stored = await AsyncStorage.getItem(GUEST_FAVORITES_KEY);
      const localIds: string[] = stored ? (JSON.parse(stored) as string[]) : [];

      if (profileId) {
        const { data } =
          await expresateService.getFavoritePictograms(profileId);
        const remoteIds = (data ?? []).map((p) => p.id);
        setFavoriteIds(new Set([...localIds, ...remoteIds]));
      } else {
        setFavoriteIds(new Set(localIds));
      }
    } catch {
      setFavoriteIds(new Set());
    } finally {
      setIsReady(true);
    }
  }, [profileId, profileLoading]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (pictogramId: string) => {
      const wasFavorite = favoriteIds.has(pictogramId);

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) {
          next.delete(pictogramId);
        } else {
          next.add(pictogramId);
        }
        return next;
      });

      try {
        const updatedIds = new Set(favoriteIds);
        if (wasFavorite) {
          updatedIds.delete(pictogramId);
        } else {
          updatedIds.add(pictogramId);
        }

        await AsyncStorage.setItem(
          GUEST_FAVORITES_KEY,
          JSON.stringify([...updatedIds]),
        );

        if (profileId) {
          const result = wasFavorite
            ? await expresateService.removeFavoritePictogram(
                profileId,
                pictogramId,
              )
            : await expresateService.addFavoritePictogram(
                profileId,
                pictogramId,
              );

          if (!result.success) {
            throw new Error(result.error || "Error al sincronizar favorito");
          }
        }
      } catch {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFavorite) {
            next.add(pictogramId);
          } else {
            next.delete(pictogramId);
          }
          return next;
        });
      }
    },
    [profileId, favoriteIds],
  );

  return { favoriteIds, toggleFavorite, isReady };
};
