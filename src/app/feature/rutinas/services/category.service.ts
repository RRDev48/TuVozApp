import { supabase } from "@/src/lib/supabaseClient";
import { Category } from "../models/category.types";

type CategoryRow = {
  id: number;
  name: string;
  image_url: string | null;
};

let categoriesCache: Category[] | null = null;
let categoriesRequest: Promise<Category[]> | null = null;

function mapCategoryRows(data: CategoryRow[] | null): Category[] {
  return (data ?? []).map((item) => ({
    id: String(item.id),
    nombre: item.name,
    image: item.image_url ?? "",
  }));
}

export async function getCategories(forceRefresh = false): Promise<Category[]> {
  if (!forceRefresh && categoriesCache) {
    return categoriesCache;
  }

  if (!forceRefresh && categoriesRequest) {
    return categoriesRequest;
  }

  const request = (async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("task_categories")
      .select("id, name, image_url");

    if (error) {
      return categoriesCache ?? [];
    }

    const mapped = mapCategoryRows((data as CategoryRow[] | null) ?? null);
    categoriesCache = mapped;
    return mapped;
  })();

  categoriesRequest = request;

  try {
    return await request;
  } finally {
    if (categoriesRequest === request) {
      categoriesRequest = null;
    }
  }
}

export function clearCategoriesCache() {
  categoriesCache = null;
  categoriesRequest = null;
}
