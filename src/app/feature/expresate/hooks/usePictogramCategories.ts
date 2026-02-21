import { useExpresate } from "@/src/app/contexts/ExpresateContext";

export const usePictogramCategories = () => {
  const { categories, isLoading, error, refetchCategories } = useExpresate();

  return { categories, isLoading, error, refetch: refetchCategories };
};
