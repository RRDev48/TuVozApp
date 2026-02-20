import { useMemo } from "react";
import { Pictogram } from "../models/pictogram.types";

interface UsePaginatedPictogramsProps {
  pictograms: Pictogram[];
  itemsPerPage: number;
}

export const usePaginatedPictograms = ({
  pictograms,
  itemsPerPage,
}: UsePaginatedPictogramsProps) => {
  const paginatedPictograms = useMemo(() => {
    const pages = [];
    for (let i = 0; i < pictograms.length; i += itemsPerPage) {
      pages.push(pictograms.slice(i, i + itemsPerPage));
    }
    return pages;
  }, [pictograms, itemsPerPage]);

  const totalPages = paginatedPictograms.length || 1;

  return { paginatedPictograms, totalPages };
};
