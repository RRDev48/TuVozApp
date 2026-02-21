import { useExpresate } from "@/src/app/contexts/ExpresateContext";

/**
 * Hook que utiliza el contexto de Expresate para acceder a las categorías precargadas
 */
export const usePictogramCategories = () => {
  const { categories, isLoading, error, refetchCategories } = useExpresate();

  return { categories, isLoading, error, refetch: refetchCategories };
};
