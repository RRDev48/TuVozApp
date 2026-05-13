import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pictogram,
  PictogramCategory,
} from "../feature/expresate/models/pictogram.types";
import { expresateService } from "../feature/expresate/services/expresate.Service";
import { useActiveProfile } from "./ActiveProfileContext";

const BASE_CACHE_KEYS = {
  categories: "expresate.categories.v1",
  pictogramsByCategory: "expresate.pictogramsByCategory.v1",
  search: "expresate.search.v1",
  customCategories: "expresate.customCategories.v1",
  customPictograms: "expresate.customPictograms.v1",
  hiddenPictograms: "expresate.hiddenPictograms.v1",
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
    includeHidden?: boolean,
  ) => Promise<{ data: Pictogram[]; fromCache: boolean; error: string | null }>;
  searchPictograms: (
    keyword: string,
  ) => Promise<{ data: Pictogram[]; fromCache: boolean; error: string | null }>;
  clearPictogramsCache: () => void;
  addCustomPictogram: (pictogram: Pictogram, categoryId: string) => Promise<void>;
  updateCategoryLocally: (categoryId: string, name: string, imageUrl: string) => Promise<void>;
  addCustomCategory: (name: string, imageUrl: string) => Promise<void>;
  deleteCustomPictogram: (pictogramId: string, categoryId: string) => Promise<void>;
  togglePictogramVisibility: (pictogramId: string, categoryId: string) => Promise<void>;
  hiddenPictogramIds: Set<string>;
  customPictograms: Pictogram[];
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
  const [customCategories, setCustomCategories] = useState<Record<string, Partial<PictogramCategory>>>({});
  const [customPictograms, setCustomPictograms] = useState<Pictogram[]>([]);
  const [hiddenPictogramIds, setHiddenPictogramIds] = useState<Set<string>>(new Set());
  const { id: profileId } = useActiveProfile();

  const cacheKeys = useMemo(() => {
    const suffix = profileId ? `_${profileId}` : "_guest";
    return {
      categories: `${BASE_CACHE_KEYS.categories}${suffix}`,
      pictogramsByCategory: `${BASE_CACHE_KEYS.pictogramsByCategory}${suffix}`,
      search: `${BASE_CACHE_KEYS.search}${suffix}`,
      customCategories: `${BASE_CACHE_KEYS.customCategories}${suffix}`,
      customPictograms: `${BASE_CACHE_KEYS.customPictograms}${suffix}`,
      hiddenPictograms: `${BASE_CACHE_KEYS.hiddenPictograms}${suffix}`,
    };
  }, [profileId]);

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

      const mergedCategories = (data || []).map(cat => {
        const custom = customCategories[cat.id];
        if (custom) {
          return { ...cat, name: custom.name || cat.name, image_url: custom.image_url || cat.image_url };
        }
        return cat;
      });

      setCategories(mergedCategories);
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
      includeHidden = false,
    ): Promise<{
      data: Pictogram[];
      fromCache: boolean;
      error: string | null;
    }> => {
      const cachedByCategory = pictogramsCacheRef.current[categoryId];

      if (cachedByCategory) {
        return {
          data: includeHidden 
            ? cachedByCategory 
            : cachedByCategory.filter(p => !hiddenPictogramIds.has(p.id.toString())),
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

        const pictograms = [
          ...(data || []),
          ...customPictograms.filter(p => p.category_id === categoryId)
        ];

        setPictogramsCache((prev) => {
          if (prev[categoryId]) {
            return prev;
          }

          return {
            ...prev,
            [categoryId]: pictograms,
          };
        });

        return { 
          data: includeHidden 
            ? pictograms 
            : pictograms.filter(p => !hiddenPictogramIds.has(p.id.toString())), 
          fromCache: false, 
          error: null 
        };
      } catch {
        return {
          data: [],
          fromCache: false,
          error: "Error al obtener pictogramas",
        };
      }
    },
    [customPictograms, cacheKeys, hiddenPictogramIds],
  );

  const addCustomPictogram = async (pictogram: Pictogram, categoryId: string) => {
    const newPictogram = { ...pictogram, category_id: categoryId, is_custom: true };
    const updated = [...customPictograms, newPictogram];
    setCustomPictograms(updated);
    await AsyncStorage.setItem(cacheKeys.customPictograms, JSON.stringify(updated));
    setPictogramsCache(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  const updateCategoryLocally = async (categoryId: string, name: string, imageUrl: string) => {
    const updated = { ...customCategories, [categoryId]: { name, image_url: imageUrl } };
    setCustomCategories(updated);
    await AsyncStorage.setItem(cacheKeys.customCategories, JSON.stringify(updated));
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, name, image_url: imageUrl } : cat
    ));
  };

  const addCustomCategory = async (name: string, imageUrl: string) => {
    const newId = `local_${Date.now()}`;
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    const newCategory = { id: newId, name, image_url: imageUrl, slug, is_custom: true };
    const updatedCustom = { ...customCategories, [newId]: { name, image_url: imageUrl } };
    setCustomCategories(updatedCustom);
    setCategories(prev => [...prev, newCategory]);
    await AsyncStorage.setItem(cacheKeys.customCategories, JSON.stringify(updatedCustom));
  };
  
  const deleteCustomPictogram = async (pictogramId: string, categoryId: string) => {
    const updated = customPictograms.filter(p => p.id.toString() !== pictogramId.toString());
    setCustomPictograms(updated);
    await AsyncStorage.setItem(cacheKeys.customPictograms, JSON.stringify(updated));
    setPictogramsCache(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  const togglePictogramVisibility = async (pictogramId: string, categoryId: string) => {
    const nextHidden = new Set(hiddenPictogramIds);
    if (nextHidden.has(pictogramId)) {
      nextHidden.delete(pictogramId);
    } else {
      nextHidden.add(pictogramId);
    }
    setHiddenPictogramIds(nextHidden);
    await AsyncStorage.setItem(cacheKeys.hiddenPictograms, JSON.stringify(Array.from(nextHidden)));
    setPictogramsCache(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  const clearPictogramsCache = useCallback(() => {
    setPictogramsCache({});
    setSearchCache({});
    void AsyncStorage.multiRemove([
      cacheKeys.pictogramsByCategory,
      cacheKeys.search,
    ]);
  }, [cacheKeys]);

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
          data: cachedByKeyword.filter(p => !hiddenPictogramIds.has(p.id.toString())),
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

        const pictograms = [
          ...(data || []),
          ...customPictograms.filter(p => 
            p.keyword.toLowerCase().includes(cacheKey)
          )
        ];

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

        return { 
          data: pictograms.filter(p => !hiddenPictogramIds.has(p.id.toString())), 
          fromCache: false, 
          error: null 
        };
      } catch {
        return {
          data: [],
          fromCache: false,
          error: "Error al buscar pictogramas",
        };
      }
    },
    [customPictograms, hiddenPictogramIds],
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
        const [
          categoriesEntry, 
          pictogramsByCategoryEntry, 
          searchEntry,
          customCatsEntry,
          customPicsEntry,
          hiddenPicsEntry
        ] = await AsyncStorage.multiGet([
            cacheKeys.categories,
            cacheKeys.pictogramsByCategory,
            cacheKeys.search,
            cacheKeys.customCategories,
            cacheKeys.customPictograms,
            cacheKeys.hiddenPictograms
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
        
        const storedCustomCats = customCatsEntry?.[1]
          ? (JSON.parse(customCatsEntry[1]) as Record<string, Partial<PictogramCategory>>)
          : {};
        
        const storedCustomPics = customPicsEntry?.[1]
          ? (JSON.parse(customPicsEntry[1]) as Pictogram[])
          : [];

        const storedHiddenPics = hiddenPicsEntry?.[1]
          ? (JSON.parse(hiddenPicsEntry[1]) as string[])
          : [];

        if (!isMounted) return;

        setCustomCategories(storedCustomCats);
        setCustomPictograms(storedCustomPics);
        setHiddenPictogramIds(new Set(storedHiddenPics));

        if (storedCategories.length > 0) {
          const localized = storedCategories.map(cat => {
            const custom = storedCustomCats[cat.id];
            return custom ? { ...cat, ...custom } : cat;
          });
          setCategories(localized);
          setHasHydratedCategories(true);
          setIsLoading(false);
        }

        setPictogramsCache(storedPictogramsByCategory);
        setSearchCache(storedSearch);
      } catch {
        // Ignore hydration failures
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    };

    void hydrateCache();

    return () => {
      isMounted = false;
    };
  }, [cacheKeys]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void fetchCategories(hasHydratedCategories);
  }, [isHydrated, hasHydratedCategories, cacheKeys]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void AsyncStorage.setItem(
        cacheKeys.categories,
        JSON.stringify(categories),
      );
    }, CACHE_PERSIST_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [categories, isHydrated, cacheKeys]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void AsyncStorage.setItem(
        cacheKeys.pictogramsByCategory,
        JSON.stringify(pictogramsCache),
      );
    }, CACHE_PERSIST_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [pictogramsCache, isHydrated, cacheKeys]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void AsyncStorage.setItem(cacheKeys.search, JSON.stringify(searchCache));
    }, CACHE_PERSIST_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchCache, isHydrated, cacheKeys]);

  const value = {
    categories,
    isLoading,
    error,
    refetchCategories: fetchCategories,
    getPictogramsByCategory,
    searchPictograms,
    clearPictogramsCache,
    addCustomPictogram,
    updateCategoryLocally,
    addCustomCategory,
    deleteCustomPictogram,
    togglePictogramVisibility,
    hiddenPictogramIds,
    customPictograms,
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
