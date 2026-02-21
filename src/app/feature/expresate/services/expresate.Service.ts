import { supabase } from "@/src/lib/supabaseClient";
import { Pictogram, PictogramCategory } from "../models/pictogram.types";

export const expresateService = {
  /**
   * Obtiene todas las categorías de pictogramas que tengan al menos un pictograma
   */
  getCategories: async (): Promise<{
    data: PictogramCategory[] | null;
    error: any;
  }> => {
    try {
      // Solo obtener categorías que tengan al menos un pictograma
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, pictograms!inner(id)")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      // Filtrar categorías únicas (inner join puede crear duplicados)
      const uniqueCategories =
        data?.reduce((acc: PictogramCategory[], curr: any) => {
          if (!acc.find((cat) => cat.id === curr.id)) {
            acc.push({
              id: curr.id,
              name: curr.name,
              slug: curr.slug,
            });
          }
          return acc;
        }, []) || [];

      return {
        data: uniqueCategories,
        error: null,
      };
    } catch (error) {
      console.error("Error in getCategories:", error);
      return { data: null, error };
    }
  },

  /**
   * Obtiene todos los pictogramas de una categoría específica
   */
  getPictogramsByCategory: async (
    categoryId: string,
  ): Promise<{
    data: Pictogram[] | null;
    error: any;
  }> => {
    try {
      const { data, error } = await supabase
        .from("pictograms")
        .select("*")
        .eq("category_id", categoryId)
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
