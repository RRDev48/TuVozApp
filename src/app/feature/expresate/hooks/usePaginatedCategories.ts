import { useMemo } from "react";
import { PictogramCategory } from "../models/pictogram.types";

interface UsePaginatedCategoriesProps {
  categories: PictogramCategory[];
  itemsPerPage: number;
}

export const usePaginatedCategories = ({
  categories,
  itemsPerPage,
}: UsePaginatedCategoriesProps) => {
  const paginatedCategories = useMemo(() => {
    const pages: PictogramCategory[][] = [];
    for (let i = 0; i < categories.length; i += itemsPerPage) {
      pages.push(categories.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [categories, itemsPerPage]);

  const totalPages = paginatedCategories.length || 1;

  return { paginatedCategories, totalPages };
};
