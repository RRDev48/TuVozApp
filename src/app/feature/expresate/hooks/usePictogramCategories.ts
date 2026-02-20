import { useCallback, useEffect, useState } from "react";
import { PictogramCategory } from "../models/pictogram.types";
import { expresateService } from "../services/expresate.Service";

export const usePictogramCategories = () => {
  const [categories, setCategories] = useState<PictogramCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error: serviceError } =
        await expresateService.getCategories();

      if (serviceError) {
        setError(serviceError.message || "Error fetching categories");
        return;
      }

      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
};
