import { supabase } from "@/src/lib/supabaseClient";
import { Pictogram, PictogramCategory } from "../models/pictogram.types";

export const expresateService = {
  getCategories: async (): Promise<{
    data: PictogramCategory[] | null;
    error: any;
  }> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, pictograms!inner(id)")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

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
