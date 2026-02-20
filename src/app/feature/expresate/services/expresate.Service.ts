import { supabase } from "@/src/lib/supabaseClient";
import { Pictogram, PictogramCategory } from "../models/pictogram.types";

export const expresateService = {
  /**
   * Obtiene todas las categorías de pictogramas directamente de la tabla categories
   */
  getCategories: async (): Promise<{
    data: PictogramCategory[] | null;
    error: any;
  }> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return {
        data: data as PictogramCategory[],
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
