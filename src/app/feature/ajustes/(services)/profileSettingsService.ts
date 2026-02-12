import { supabase } from "@/src/lib/supabaseClient";

export interface ProfileSettings {
  profile_id: string;
  font_size: number;
  theme: "light" | "dark" | "system";
  uppercase: boolean;
  high_contrast: boolean;
  language: "es" | "en" | "pt";
  updated_at?: string;
}

export interface ProfileSettingsInput {
  font_size?: number;
  theme?: "light" | "dark" | "system";
  uppercase?: boolean;
  high_contrast?: boolean;
  language?: "es" | "en" | "pt";
}

export class ProfileSettingsService {
  /**
   * Obtiene la configuración de personalización de un perfil
   */
  static async getProfileSettings(
    profileId: string,
  ): Promise<ProfileSettings | null> {
    const { data, error } = await supabase
      .from("profile_settings")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No existe configuración, retornar configuración por defecto
        return null;
      }
      throw new Error(
        `Error obteniendo configuración del perfil: ${error.message}`,
      );
    }

    return data;
  }

  /**
   * Crea o actualiza la configuración de personalización de un perfil
   */
  static async upsertProfileSettings(
    profileId: string,
    settings: ProfileSettingsInput,
  ): Promise<ProfileSettings> {
    const { data, error } = await supabase
      .from("profile_settings")
      .upsert({
        profile_id: profileId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Error guardando configuración del perfil: ${error.message}`,
      );
    }

    return data;
  }

  /**
   * Actualiza una configuración específica del perfil
   */
  static async updateProfileSetting<K extends keyof ProfileSettingsInput>(
    profileId: string,
    key: K,
    value: ProfileSettingsInput[K],
  ): Promise<ProfileSettings> {
    const settings: ProfileSettingsInput = {
      [key]: value,
    };

    return this.upsertProfileSettings(profileId, settings);
  }

  /**
   * Elimina la configuración de personalización de un perfil
   */
  static async deleteProfileSettings(profileId: string): Promise<void> {
    const { error } = await supabase
      .from("profile_settings")
      .delete()
      .eq("profile_id", profileId);

    if (error) {
      throw new Error(
        `Error eliminando configuración del perfil: ${error.message}`,
      );
    }
  }

  /**
   * Convierte el font_size de la base de datos al formato usado en la app
   */
  static mapFontSizeToAppSize(
    fontSize: number,
  ): "pequenia" | "mediana" | "grande" {
    if (fontSize <= 12) return "pequenia";
    if (fontSize >= 22) return "grande";
    return "mediana";
  }

  /**
   * Convierte el tamaño de la app al font_size de la base de datos
   */
  static mapAppSizeToFontSize(
    appSize: "pequenia" | "mediana" | "grande",
  ): number {
    switch (appSize) {
      case "pequenia":
        return 12;
      case "grande":
        return 22;
      default:
        return 16;
    }
  }

  /**
   * Convierte el tema de la app al formato de la base de datos
   */
  static mapAppThemeToDbTheme(temaOscuro: boolean): "light" | "dark" {
    return temaOscuro ? "dark" : "light";
  }

  /**
   * Convierte el tema de la base de datos al formato de la app
   */
  static mapDbThemeToAppTheme(theme: string): boolean {
    return theme === "dark";
  }

  /**
   * Obtiene la configuración por defecto
   */
  static getDefaultSettings(): ProfileSettingsInput {
    return {
      font_size: 16,
      theme: "light",
      uppercase: false,
      high_contrast: false,
      language: "es",
    };
  }
}
