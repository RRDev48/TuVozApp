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
        return null;
      }
      throw new Error(
        `Error obteniendo configuración del perfil: ${error.message}`,
      );
    }

    return data;
  }

  static async upsertProfileSettings(
    profileId: string,
    settings: ProfileSettingsInput,
  ): Promise<ProfileSettings> {
    const upsertData = {
      profile_id: profileId,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profile_settings")
      .upsert(upsertData)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Error guardando configuración del perfil: ${error.message}`,
      );
    }
    return data;
  }

  static async updateProfileSetting<K extends keyof ProfileSettingsInput>(
    profileId: string,
    key: K,
    value: ProfileSettingsInput[K],
  ): Promise<ProfileSettings> {
    const settings: ProfileSettingsInput = {
      [key]: value,
    };
    const result = await this.upsertProfileSettings(profileId, settings);
    return result;
  }

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

  static mapAppThemeToDbTheme(temaOscuro: boolean): "light" | "dark" {
    return temaOscuro ? "dark" : "light";
  }

  static mapDbThemeToAppTheme(theme: string): boolean {
    return theme === "dark";
  }

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
