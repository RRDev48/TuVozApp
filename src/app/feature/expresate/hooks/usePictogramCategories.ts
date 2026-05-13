import { useExpresate } from "@/src/app/contexts/ExpresateContext";

export const usePictogramCategories = () => {
  const { categories, isLoading, error, refetchCategories, customPictograms } = useExpresate();

  const filteredCategories = categories.filter(cat => {
    const remoteCount = cat.pictograms?.[0]?.count || 0;
    const localCount = customPictograms.filter(p => p.category_id === cat.id).length;
    return (remoteCount + localCount) > 0;
  });

  return { categories: filteredCategories, isLoading, error, refetch: refetchCategories };
};
