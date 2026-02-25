import { useExpresate } from "@/src/app/contexts/ExpresateContext";
import { useCallback, useEffect, useState } from "react";
import { Pictogram } from "../models/pictogram.types";

export const useSearchPictograms = (searchQuery: string) => {
  const { searchPictograms } = useExpresate();
  const [pictograms, setPictograms] = useState<Pictogram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPictograms = useCallback(async () => {
    if (!searchQuery.trim()) {
      setPictograms([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, fromCache } = await searchPictograms(searchQuery);

      setPictograms(data);
      setError(null);

      if (fromCache) {
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPictograms([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchPictograms]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPictograms();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [fetchPictograms]);

  return { pictograms, isLoading, error, refetch: fetchPictograms };
};
