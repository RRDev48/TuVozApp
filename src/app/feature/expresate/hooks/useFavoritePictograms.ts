import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrentUserProfile } from "../../ajustes/hooks/useCurrentUserProfile";
import { Pictogram } from "../models/pictogram.types";
import { expresateService } from "../services/expresate.Service";

const BASE_FAVORITES_KEY = "@tuVoz:favorites";

export const useFavoritePictograms = () => {
  const {
    profileId,
    userId,
    isAuthenticated,
    loading: profileLoading,
  } = useCurrentUserProfile();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoritePictograms, setFavoritePictograms] = useState<Pictogram[]>([]);
  const [isReady, setIsReady] = useState(false);
  const favoriteIdsRef = useRef<Set<string>>(new Set());

  const storageKey = useMemo(() => {
    if (profileId) return `${BASE_FAVORITES_KEY}_${profileId}`;
    return "@tuVoz:guest_favorites";
  }, [profileId]);

  useEffect(() => {
    favoriteIdsRef.current = favoriteIds;
  }, [favoriteIds]);

  const fetchFavorites = useCallback(async () => {
    if (profileLoading || !storageKey) return;

    try {
      const stored = await AsyncStorage.getItem(storageKey);
      const localIds: string[] = stored ? (JSON.parse(stored) as string[]) : [];

      if (profileId) {
        if (localIds.length > 0) {
          await expresateService.syncFavoritePictograms(
            profileId,
            localIds,
          );
        }

        const { data } =
          await expresateService.getFavoritePictograms(profileId);
        const remotePictograms = data ?? [];
        const remoteIds = remotePictograms.map((p) => p.id.toString());
        const localIdsParsed = (localIds as (string | number)[]).map(id => id.toString());
        const merged = new Set([...localIdsParsed, ...remoteIds]);

        setFavoriteIds(merged);
        setFavoritePictograms(remotePictograms);
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify([...merged]),
        );
      } else {
        setFavoriteIds(new Set(localIds));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavoriteIds(new Set());
    } finally {
      setIsReady(true);
    }
  }, [profileLoading, profileId, storageKey]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (pictogramId: string) => {
      if (!storageKey) return;

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
          storageKey,
          JSON.stringify([...nextIds]),
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
            return;
          }
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
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
    [profileId, storageKey],
  );

  return { favoriteIds, favoritePictograms, toggleFavorite, isReady };
};
