import { useEffect, useCallback } from "react";
import { pictogramImagePreloader } from "../services/pictogramImagePreloader.Service";
import { pictogramCacheService } from "../services/pictogramCache.Service";

export function usePictogramPreloader() {
  useEffect(() => {
    pictogramImagePreloader.preloadPriorityImages();
    pictogramCacheService.initialize();
  }, []);

  const preloadCategoryImages = useCallback(async (pictogramIds: string[]) => {
    await pictogramImagePreloader.preloadCategory("category", pictogramIds);
  }, []);

  const preloadInBackground = useCallback((pictogramIds: string[]) => {
    pictogramImagePreloader.preloadInBackground(pictogramIds);
  }, []);

  const isPreloaded = useCallback((arasaacId: string): boolean => {
    return pictogramImagePreloader.isPreloaded(arasaacId);
  }, []);

  return {
    preloadCategoryImages,
    preloadInBackground,
    isPreloaded,
  };
}