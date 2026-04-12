import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Pictogram,
  PictogramCategory,
} from "../feature/expresate/models/pictogram.types";
import { expresateService } from "../feature/expresate/services/expresate.Service";

const CACHE_KEYS = {
  categories: "expresate.categories.v1",
  pictogramsByCategory: "expresate.pictogramsByCategory.v1",
  search: "expresate.search.v1",
};

const SEARCH_CACHE_MAX_ENTRIES = 25;
const CACHE_PERSIST_DEBOUNCE_MS = 250;

interface ExpresateContextType {
  categories: PictogramCategory[];
  isLoading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
  getPictogramsByCategory: (
    categoryId: string,
  ) => Promise<{ data: Pictogram[]; fromCache: boolean; error: string | null }>;
  searchPictograms: (
    keyword: string,
  ) => Promise<{ data: Pictogram[]; fromCache: boolean; error: string | null }>;
  clearPictogramsCache: () => void;
}

const ExpresateContext = createContext<ExpresateContextType | undefined>(
  undefined,
);

export const ExpresateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<PictogramCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pictogramsCache, setPictogramsCache] = useState<
    Record<string, Pictogram[]>
  >({});
  const [searchCache, setSearchCache] = useState<Record<string, Pictogram[]>>(
    {},
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasHydratedCategories, setHasHydratedCategories] = useState(false);
  const pictogramsCacheRef = useRef<Record<string, Pictogram[]>>({});
  const searchCacheRef = useRef<Record<string, Pictogram[]>>({});

  const fetchCategories = async (background = false) => {
    try {
      if (!background) {
        setIsLoading(true);
      }

      const { data, error: serviceError } =
        await expresateService.getCategories();

      if (serviceError) {
        if (!background) {
          setError(serviceError || "Error fetching categories");
          setCategories([]);
        }
        return;
      }

      setCategories(data || []);
      setError(null);
    } catch (err) {
      if (!background) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setCategories([]);
      }
    } finally {
      if (!background) {
        setIsLoading(false);
      }
    }
  };

  const getPictogramsByCategory = useCallback(
    async (
      categoryId: string,
    ): Promise<{
      data: Pictogram[];
      fromCache: boolean;
      error: string | null;
    }> => {
      const cachedByCategory = pictogramsCacheRef.current[categoryId];

      if (cachedByCategory) {
        return {
          data: cachedByCategory,
          fromCache: true,
          error: null,
        };
      }

      try {
        const { data, error: serviceError } =
          await expresateService.getPictogramsByCategory(categoryId);

        if (serviceError) {
          return { data: [], fromCache: false, error: serviceError };
        }

        const pictograms = data || [];

        setPictogramsCache((prev) => {
          if (prev[categoryId]) {
            return prev;
          }

          return {
            ...prev,
            [categoryId]: pictograms,
          };
        });

        return { data: pictograms, fromCache: false, error: null };
      } catch {
        return {
          data: [],
          fromCache: false,
          error: "Error al obtener pictogramas",
        };
      }
    },
    [],
  );

  const clearPictogramsCache = useCallback(() => {
    setPictogramsCache({});
    setSearchCache({});
    void AsyncStorage.multiRemove([
      CACHE_KEYS.pictogramsByCategory,
      CACHE_KEYS.search,
    ]);
  }, []);

  const searchPictograms = useCallback(
    async (
      keyword: string,
    ): Promise<{
      data: Pictogram[];
      fromCache: boolean;
      error: string | null;
    }> => {
      const cacheKey = keyword.trim().toLowerCase();
      const cachedByKeyword = searchCacheRef.current[cacheKey];

      if (cachedByKeyword) {
        return {
          data: cachedByKeyword,
          fromCache: true,
          error: null,
        };
      }

      try {
        const { data, error: serviceError } =
          await expresateService.searchPictograms(keyword);

        if (serviceError) {
          return { data: [], fromCache: false, error: serviceError };
        }

        const pictograms = data || [];

        setSearchCache((prev) => {
          if (prev[cacheKey]) {
            return prev;
          }

          const next = {
            ...prev,
            [cacheKey]: pictograms,
          };

          const keys = Object.keys(next);

          if (keys.length <= SEARCH_CACHE_MAX_ENTRIES) {
            return next;
          }

          const keysToDrop = keys.slice(
            0,
            keys.length - SEARCH_CACHE_MAX_ENTRIES,
          );
          const bounded = { ...next };

          keysToDrop.forEach((key) => {
            delete bounded[key];
          });

          return bounded;
        });

        return { data: pictograms, fromCache: false, error: null };
      } catch {
        return {
          data: [],
          fromCache: false,
          error: "Error al buscar pictogramas",
        };
      }
    },
    [],
  );

  useEffect(() => {
    pictogramsCacheRef.current = pictogramsCache;
  }, [pictogramsCache]);

  useEffect(() => {
    searchCacheRef.current = searchCache;
  }, [searchCache]);

  useEffect(() => {
    let isMounted = true;

    const hydrateCache = async () => {
      try {
        const [categoriesEntry, pictogramsByCategoryEntry, searchEntry] =
          await AsyncStorage.multiGet([
            CACHE_KEYS.categories,
            CACHE_KEYS.pictogramsByCategory,
            CACHE_KEYS.search,
          ]);

        const storedCategories = categoriesEntry?.[1]
          ? (JSON.parse(categoriesEntry[1]) as PictogramCategory[])
          : [];
        const storedPictogramsByCategory = pictogramsByCategoryEntry?.[1]
          ? (JSON.parse(pictogramsByCategoryEntry[1]) as Record<
              string,
              Pictogram[]
            >)
          : {};
        const storedSearch = searchEntry?.[1]
          ? (JSON.parse(searchEntry[1]) as Record<string, Pictogram[]>)
          : {};

        if (!isMounted) {
          return;
        }

        if (storedCategories.length > 0) {
          setCategories(storedCategories);
          setHasHydratedCategories(true);
          setIsLoading(false);
        }

        setPictogramsCache(storedPictogramsByCategory);
        setSearchCache(storedSearch);
      } catch {
        // Ignore hydration failures and continue with network fetch.
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    void hydrateCache();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void fetchCategories(hasHydratedCategories);
  }, [isHydrated, hasHydratedCategories]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void AsyncStorage.setItem(
        CACHE_KEYS.categories,
        JSON.stringify(categories),
      );
    }, CACHE_PERSIST_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [categories, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void AsyncStorage.setItem(
        CACHE_KEYS.pictogramsByCategory,
        JSON.stringify(pictogramsCache),
      );
    }, CACHE_PERSIST_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [pictogramsCache, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void AsyncStorage.setItem(CACHE_KEYS.search, JSON.stringify(searchCache));
    }, CACHE_PERSIST_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchCache, isHydrated]);

  const value = {
    categories,
    isLoading,
    error,
    refetchCategories: fetchCategories,
    getPictogramsByCategory,
    searchPictograms,
    clearPictogramsCache,
  };

  return (
    <ExpresateContext.Provider value={value}>
      {children}
    </ExpresateContext.Provider>
  );
};

export const useExpresate = () => {
  const context = useContext(ExpresateContext);
  if (context === undefined) {
    throw new Error("useExpresate must be used within an ExpresateProvider");
  }
  return context;
};

export default ExpresateProvider;
