import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const LAZY_LOAD_THRESHOLD = 1.5;

type UsePictogramImageLoaderOptions = {
  initialVisible?: boolean;
  preloadDistance?: number;
};

type UsePictogramImageLoaderReturn = {
  isVisible: boolean;
  isLoaded: boolean;
  isInView: (layoutY: number) => boolean;
  markAsVisible: () => void;
  markAsLoaded: () => void;
  preloadNextItems: (currentIndex: number, totalItems: number, itemHeight: number) => void;
};

export function usePictogramImageLoader(options: UsePictogramImageLoaderOptions = {}): UsePictogramImageLoaderReturn {
  const { initialVisible = false, preloadDistance = 2 } = options;
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastVisibleTime = useRef<number>(0);

  const isInView = useCallback((layoutY: number): boolean => {
    const viewportTop = 0;
    const viewportBottom = SCREEN_HEIGHT * LAZY_LOAD_THRESHOLD;
    return layoutY >= viewportTop - preloadDistance * 100 && layoutY <= viewportBottom;
  }, [preloadDistance]);

  const markAsVisible = useCallback(() => {
    const now = Date.now();
    if (!isVisible || now - lastVisibleTime.current > 1000) {
      lastVisibleTime.current = now;
      setIsVisible(true);
    }
  }, [isVisible]);

  const markAsLoaded = useCallback(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  const preloadNextItems = useCallback((currentIndex: number, totalItems: number, _itemHeight: number) => {
    const nextItems: number[] = [];
    for (let i = 1; i <= preloadDistance && currentIndex + i < totalItems; i++) {
      nextItems.push(currentIndex + i);
    }
    return nextItems;
  }, [preloadDistance]);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

  return {
    isVisible,
    isLoaded,
    isInView,
    markAsVisible,
    markAsLoaded,
    preloadNextItems,
  };
}

type PreloadResult = {
  success: boolean;
  loadedCount: number;
  failedCount: number;
};

export async function preloadPictogramImages(
  arasaacIds: string[],
  onProgress?: (loaded: number, total: number) => void,
): Promise<PreloadResult> {
  const ARASAAC_BASE_URL = "https://api.arasaac.org/v1/pictograms";
  let loadedCount = 0;
  let failedCount = 0;
  const total = arasaacIds.length;

  const imageCache = new Map<string, Promise<boolean>>();

  const loadImage = (arasaacId: string): Promise<boolean> => {
    if (imageCache.has(arasaacId)) {
      return imageCache.get(arasaacId)!;
    }

    const promise = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedCount++;
        onProgress?.(loadedCount, total);
        resolve(true);
      };
      img.onerror = () => {
        failedCount++;
        onProgress?.(loadedCount + failedCount, total);
        resolve(false);
      };
      img.src = `${ARASAAC_BASE_URL}/${arasaacId}`;
    });

    imageCache.set(arasaacId, promise);
    return promise;
  };

  const batchSize = 10;
  for (let i = 0; i < arasaacIds.length; i += batchSize) {
    const batch = arasaacIds.slice(i, i + batchSize);
    await Promise.all(batch.map((id) => loadImage(id)));
  }

  return {
    success: failedCount === 0,
    loadedCount,
    failedCount,
  };
}

export function useImagePreloader() {
  const preloadedIds = useRef<Set<string>>(new Set());

  const preloadIfNeeded = useCallback((arasaacId: string): boolean => {
    if (preloadedIds.current.has(arasaacId)) {
      return true;
    }

    const img = new (window as unknown as { Image: new () => HTMLImageElement }).Image();
    img.src = `https://api.arasaac.org/v1/pictograms/${arasaacId}`;
    preloadedIds.current.add(arasaacId);
    return true;
  }, []);

  const isPreloaded = useCallback((arasaacId: string): boolean => {
    return preloadedIds.current.has(arasaacId);
  }, []);

  const clearCache = useCallback(() => {
    preloadedIds.current.clear();
  }, []);

  return {
    preloadIfNeeded,
    isPreloaded,
    clearCache,
    preloadedCount: preloadedIds.current.size,
  };
}