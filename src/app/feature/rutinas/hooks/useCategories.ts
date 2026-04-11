import { useEffect, useState } from "react";
import { Category } from "../models/category.types";
import { getCategories } from "../services/category.service";

export function useCategories(enabled = true) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (enabled) {
      setLoading(true);
      getCategories()
        .then((cats) => {
          if (isMounted) {
            setCategories(cats);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return { categories, loading };
}
