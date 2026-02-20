import { useCallback, useEffect, useState } from "react";
import { Pictogram } from "../models/pictogram.types";
import { expresateService } from "../services/expresate.Service";

export const usePictogramsByCategory = (categoryId: string) => {
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
      const { data, error: serviceError } =
        await expresateService.getPictogramsByCategory(categoryId);

      if (serviceError) {
        setError(serviceError.message || "Error fetching pictograms");
        return;
      }

      setPictograms(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchPictograms();
  }, [fetchPictograms]);

  return { pictograms, isLoading, error, refetch: fetchPictograms };
};
