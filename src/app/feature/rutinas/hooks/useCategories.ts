import { useEffect, useState } from "react";
import { Category } from "../models/category.types";
import { getCategories } from "../services/category.service";

export function useCategories(visible: boolean) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getCategories()
        .then((cats) => setCategories(cats))
        .finally(() => setLoading(false));
    }
  }, [visible]);

  return { categories, loading };
}
