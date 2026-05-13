import { auditLogService } from "@/src/app/feature/ajustes/services/auditLog.Service";
import { supabase } from "@/src/lib/supabaseClient";
import { Pictogram, PictogramCategory } from "../models/pictogram.types";

type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};

type MutationResult = {
  success: boolean;
  error: string | null;
};

type FavoritePictogramRow = {
  pictogram_id: string;
  pictograms: Pictogram | Pictogram[] | null;
};

type CategoryWithPictogramsRow = PictogramCategory & {
  pictograms: Array<{ id: string }>;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const supabaseError = error as { message?: string };
    return supabaseError.message || fallback;
  }

  return fallback;
}

function isDuplicateKeyError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const supabaseError = error as { code?: string };
    return supabaseError.code === "23505";
  }

  return false;
}

function normalizeJoinedRow<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export const expresateService = {
  getCategories: async (): Promise<ServiceResult<PictogramCategory[]>> => {
    try {
      const { data, error } = await supabase
        .from("pictograms_categories")
        .select("id, name, slug, image_url, pictograms(count)")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      return {
        data: (data as PictogramCategory[] | null) ?? [],
        error: null,
      };
    } catch (error: unknown) {
      return {
        data: null,
        error: getErrorMessage(error, "Error al obtener categorías"),
      };
    }
  },

  getPictogramsByCategory: async (
    categoryId: string,
  ): Promise<ServiceResult<Pictogram[]>> => {
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
    } catch (error: unknown) {
      return {
        data: null,
        error: getErrorMessage(error, "Error al obtener pictogramas"),
      };
    }
  },

  searchPictograms: async (
    keyword: string,
  ): Promise<ServiceResult<Pictogram[]>> => {
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
    } catch (error: unknown) {
      return {
        data: null,
        error: getErrorMessage(error, "Error al buscar pictogramas"),
      };
    }
  },

  getPictogramById: async (id: string): Promise<ServiceResult<Pictogram>> => {
    try {
      const { data, error } = await supabase
        .from("pictograms")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return { data: (data as Pictogram | null) ?? null, error: null };
    } catch (error: unknown) {
      return {
        data: null,
        error: getErrorMessage(error, "Error al obtener el pictograma"),
      };
    }
  },

  addFavoritePictogram: async (
    profileId: string,
    pictogramId: string,
  ): Promise<MutationResult> => {
    try {
      const { error } = await supabase.from("favorite_pictograms").insert({
        profile_id: profileId,
        pictogram_id: pictogramId,
      });

      if (error) {
        if (isDuplicateKeyError(error)) {
          return { success: true, error: null };
        }
        throw error;
      }

      await auditLogService.logEventSafe({
        profile_id: profileId,
        event_type: auditLogService.events.FAVORITE_PICTOGRAM_ADDED,
        description: "Favorite pictogram added",
        metadata: { profile_id: profileId, pictogram_id: pictogramId },
        source: "expresate.service.addFavoritePictogram",
      });

      return { success: true, error: null };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al agregar favorito"),
      };
    }
  },

  syncFavoritePictograms: async (
    profileId: string,
    pictogramIds: string[],
  ): Promise<MutationResult> => {
    try {
      if (pictogramIds.length === 0) {
        return { success: true, error: null };
      }

      const { data: existingRows, error: existingError } = await supabase
        .from("favorite_pictograms")
        .select("pictogram_id")
        .eq("profile_id", profileId);

      if (existingError) {
        throw existingError;
      }

      const existingIds = new Set(
        ((existingRows as Array<{ pictogram_id: string }> | null) ?? []).map(
          (row) => row.pictogram_id,
        ),
      );

      const missingIds = pictogramIds.filter((id) => !existingIds.has(id));

      if (missingIds.length === 0) {
        return { success: true, error: null };
      }

      const rows = missingIds.map((pictogramId) => ({
        profile_id: profileId,
        pictogram_id: pictogramId,
      }));

      const { error } = await supabase.from("favorite_pictograms").insert(rows);

      if (error && !isDuplicateKeyError(error)) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al sincronizar favoritos"),
      };
    }
  },

  removeFavoritePictogram: async (
    profileId: string,
    pictogramId: string,
  ): Promise<MutationResult> => {
    try {
      const { error } = await supabase
        .from("favorite_pictograms")
        .delete()
        .eq("profile_id", profileId)
        .eq("pictogram_id", pictogramId);

      if (error) {
        throw error;
      }

      await auditLogService.logEventSafe({
        profile_id: profileId,
        event_type: auditLogService.events.FAVORITE_PICTOGRAM_REMOVED,
        description: "Favorite pictogram removed",
        metadata: { profile_id: profileId, pictogram_id: pictogramId },
        source: "expresate.service.removeFavoritePictogram",
      });

      return { success: true, error: null };
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al quitar favorito"),
      };
    }
  },

  getFavoritePictograms: async (
    profileId: string,
  ): Promise<ServiceResult<Pictogram[]>> => {
    try {
      const { data, error } = await supabase
        .from("favorite_pictograms")
        .select("pictogram_id, pictograms(*)")
        .eq("profile_id", profileId);

      if (error) {
        throw error;
      }

      const pictograms =
        (data as FavoritePictogramRow[] | null)
          ?.map((item) => normalizeJoinedRow(item.pictograms))
          .filter((item): item is Pictogram => item !== null) || [];

      return { data: pictograms as Pictogram[], error: null };
    } catch (error: unknown) {
      return {
        data: null,
        error: getErrorMessage(error, "Error al obtener favoritos"),
      };
    }
  },
};
