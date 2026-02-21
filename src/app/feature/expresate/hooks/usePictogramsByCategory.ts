import { useExpresate } from "@/src/app/contexts/ExpresateContext";
import { useCallback, useEffect, useState } from "react";
import { Pictogram } from "../models/pictogram.types";

export const usePictogramsByCategory = (categoryId: string) => {
  const { getPictogramsByCategory } = useExpresate();
  const [pictograms, setPictograms] = useState<Pictogram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPictograms = useCallback(async () => {
    if (!categoryId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, fromCache } = await getPictogramsByCategory(categoryId);

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
  }, [categoryId, getPictogramsByCategory]);

  useEffect(() => {
    fetchPictograms();
  }, [fetchPictograms]);

  return { pictograms, isLoading, error, refetch: fetchPictograms };
};
