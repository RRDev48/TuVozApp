import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentUserProfile } from "../../ajustes/hooks/useCurrentUserProfile";
import { emergencyService } from "../../emergencias/services/emergency.Service";
import { expresateService } from "../services/expresate.Service";

const GUEST_FAVORITES_KEY = "@tuVoz:guest_favorites";

export const useFavoritePictograms = () => {
  const {
    profileId,
    userId,
    isAuthenticated,
    loading: profileLoading,
  } = useCurrentUserProfile();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);
  const favoriteIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    favoriteIdsRef.current = favoriteIds;
  }, [favoriteIds]);

  const resolveProfileId = useCallback(async () => {
    if (profileId) {
      return profileId;
    }

    if (!isAuthenticated || !userId) {
      return null;
    }

    try {
      return await emergencyService.getCurrentUserProfileId(userId);
    } catch {
      return null;
    }
  }, [profileId, isAuthenticated, userId]);

  const fetchFavorites = useCallback(async () => {
    if (profileLoading) return;

    try {
      const stored = await AsyncStorage.getItem(GUEST_FAVORITES_KEY);
      const localIds: string[] = stored ? (JSON.parse(stored) as string[]) : [];
      const effectiveProfileId = await resolveProfileId();

      if (effectiveProfileId) {
        if (localIds.length > 0) {
          await expresateService.syncFavoritePictograms(
            effectiveProfileId,
            localIds,
          );
        }

        const { data } =
          await expresateService.getFavoritePictograms(effectiveProfileId);
        const remoteIds = (data ?? []).map((p) => p.id);
        const merged = new Set([...localIds, ...remoteIds]);

        setFavoriteIds(merged);
        await AsyncStorage.setItem(
          GUEST_FAVORITES_KEY,
          JSON.stringify([...merged]),
        );
      } else {
        setFavoriteIds(new Set(localIds));
      }
    } catch {
      setFavoriteIds(new Set());
    } finally {
      setIsReady(true);
    }
  }, [profileLoading, resolveProfileId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (pictogramId: string) => {
      const nextIds = new Set(favoriteIdsRef.current);
      const wasFavorite = nextIds.has(pictogramId);

      if (wasFavorite) {
        nextIds.delete(pictogramId);
      } else {
        nextIds.add(pictogramId);
      }

      favoriteIdsRef.current = nextIds;
      setFavoriteIds(nextIds);

      try {
        await AsyncStorage.setItem(
          GUEST_FAVORITES_KEY,
          JSON.stringify([...nextIds]),
        );

        const effectiveProfileId = await resolveProfileId();

        if (effectiveProfileId) {
          const result = wasFavorite
            ? await expresateService.removeFavoritePictogram(
                effectiveProfileId,
                pictogramId,
              )
            : await expresateService.addFavoritePictogram(
                effectiveProfileId,
                pictogramId,
              );

          if (!result.success) {
            return;
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
    [resolveProfileId],
  );

  return { favoriteIds, toggleFavorite, isReady };
};
