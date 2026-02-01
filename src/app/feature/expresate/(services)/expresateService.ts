import { supabase } from "@/src/lib/supabaseClient";

export interface PictogramCategory {
  id: number;
  category_slug: string;
  arasaac_id: number;
}

export interface Pictogram {
  id: number;
  arasaac_id: number;
  keyword: string;
  arasaac_categories: string[] | null;
  category_slug: string;
  language: string;
  last_sync: string | null;
  created_at: string | null;
}

export const expresateService = {
  /**
   * Obtiene todas las categorías únicas de pictogramas
   * Con ~2500 pictogramas y 14 categorías, traemos todos los registros
   * y deduplicamos por category_slug
   */
  getCategories: async (): Promise<{
    data: PictogramCategory[] | null;
    error: any;
  }> => {
    try {
      // Traer todos los pictogramas para obtener categorías únicas
      // Sin order para evitar límites implícitos de RLS
      const { data, error, count } = await supabase
        .from("pictograms")
        .select("id, category_slug, arasaac_id", { count: "exact" })
        .limit(3000);

      if (error) {
        console.error("Error fetching pictograms:", error);
        throw error;
      }

      console.log(`Fetched ${data?.length} pictograms, total count: ${count}`);

      // Deduplicar por category_slug - mantiene el primer registro de cada categoría
      const categoryMap = new Map<string, PictogramCategory>();

      if (data && Array.isArray(data)) {
        for (const item of data as PictogramCategory[]) {
          if (!categoryMap.has(item.category_slug)) {
            categoryMap.set(item.category_slug, item);
          }
        }
      }

      const uniqueCategories = Array.from(categoryMap.values()).sort((a, b) =>
        a.category_slug.localeCompare(b.category_slug),
      );

      console.log(
        `Found ${uniqueCategories.length} unique categories:`,
        uniqueCategories.map((c) => c.category_slug),
      );

      return { data: uniqueCategories, error: null };
    } catch (error) {
      console.error("Error in getCategories:", error);
      return { data: null, error };
    }
  },

  /**
   * Obtiene todos los pictogramas de una categoría específica
   */
  getPictogramsByCategory: async (
    categorySlug: string,
  ): Promise<{
    data: Pictogram[] | null;
    error: any;
  }> => {
    try {
      const { data, error } = await supabase
        .from("pictograms")
        .select("*")
        .eq("category_slug", categorySlug)
        .order("keyword", { ascending: true });

      if (error) {
        throw error;
      }

      return { data: data as Pictogram[], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Busca pictogramas por palabra clave
   */
  searchPictograms: async (
    keyword: string,
  ): Promise<{
    data: Pictogram[] | null;
    error: any;
  }> => {
    try {
      const { data, error } = await supabase
        .from("pictograms")
        .select("*")
        .ilike("keyword", `%${keyword}%`)
        .order("keyword", { ascending: true });

      if (error) {
        throw error;
      }

      return { data: data as Pictogram[], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Obtiene un pictograma específico por ID
   */
  getPictogramById: async (
    id: number,
  ): Promise<{
    data: Pictogram | null;
    error: any;
  }> => {
    try {
      const { data, error } = await supabase
        .from("pictograms")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return { data: data as Pictogram, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
