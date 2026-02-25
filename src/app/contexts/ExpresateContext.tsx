import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Pictogram,
  PictogramCategory,
} from "../feature/expresate/models/pictogram.types";
import { expresateService } from "../feature/expresate/services/expresate.Service";

interface ExpresateContextType {
  categories: PictogramCategory[];
  isLoading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
  getPictogramsByCategory: (
    categoryId: string,
  ) => Promise<{ data: Pictogram[]; fromCache: boolean }>;
  searchPictograms: (
    keyword: string,
  ) => Promise<{ data: Pictogram[]; fromCache: boolean }>;
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

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error: serviceError } =
        await expresateService.getCategories();

      if (serviceError) {
        setError(serviceError.message || "Error fetching categories");
        setCategories([]);
        return;
      }

      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPictogramsByCategory = useCallback(
    async (
      categoryId: string,
    ): Promise<{ data: Pictogram[]; fromCache: boolean }> => {
      if (pictogramsCache[categoryId]) {
        return { data: pictogramsCache[categoryId], fromCache: true };
      }

      try {
        const { data, error: serviceError } =
          await expresateService.getPictogramsByCategory(categoryId);

        if (serviceError) {
          console.error("Error fetching pictograms:", serviceError);
          return { data: [], fromCache: false };
        }

        const pictograms = data || [];

        setPictogramsCache((prev) => ({
          ...prev,
          [categoryId]: pictograms,
        }));

        return { data: pictograms, fromCache: false };
      } catch (err) {
        console.error("Error in getPictogramsByCategory:", err);
        return { data: [], fromCache: false };
      }
    },
    [pictogramsCache],
  );

  const clearPictogramsCache = useCallback(() => {
    setPictogramsCache({});
    setSearchCache({});
  }, []);

  const searchPictograms = useCallback(
    async (
      keyword: string,
    ): Promise<{ data: Pictogram[]; fromCache: boolean }> => {
      const cacheKey = keyword.toLowerCase();

      if (searchCache[cacheKey]) {
        return { data: searchCache[cacheKey], fromCache: true };
      }

      try {
        const { data, error: serviceError } =
          await expresateService.searchPictograms(keyword);

        if (serviceError) {
          console.error("Error searching pictograms:", serviceError);
          return { data: [], fromCache: false };
        }

        const pictograms = data || [];

        setSearchCache((prev) => ({
          ...prev,
          [cacheKey]: pictograms,
        }));

        return { data: pictograms, fromCache: false };
      } catch (err) {
        console.error("Error in searchPictograms:", err);
        return { data: [], fromCache: false };
      }
    },
    [searchCache],
  );

  useEffect(() => {
    fetchCategories();
  }, []);

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
