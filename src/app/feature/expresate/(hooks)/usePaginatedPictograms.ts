import { Pictogram } from "@/src/app/feature/expresate/(types)/expresate.types";
import { useMemo } from "react";

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
