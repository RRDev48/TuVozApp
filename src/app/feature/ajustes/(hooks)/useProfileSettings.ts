import { useCallback, useEffect, useState } from "react";
import {
    ProfileSettings,
    ProfileSettingsInput,
    ProfileSettingsService,
} from "../(services)/profileSettingsService";
import { useErrorHandling } from "./useErrorHandling";

export interface UseProfileSettingsReturn {
  settings: ProfileSettings | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Operaciones CRUD
  updateSetting: <K extends keyof ProfileSettingsInput>(
    key: K,
    value: ProfileSettingsInput[K],
  ) => Promise<void>;
  updateSettings: (settings: ProfileSettingsInput) => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;

  // Mappers para compatibilidad con la app existente
  getFontSizeForApp: () => "pequenia" | "mediana" | "grande";
  getThemeForApp: () => boolean;
  getUppercaseForApp: () => boolean;
  getLanguageForApp: () => string;
}

export const useProfileSettings = (profileId?: string) => {
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { logAndShowError } = useErrorHandling();

  // Verificar si hay usuario autenticado
  useEffect(() => {
    console.log("🎯 useProfileSettings - profileId recibido:", profileId);
    setIsAuthenticated(!!profileId);
    if (profileId) {
      loadSettings();
    } else {
      // Usuario no autenticado, usar valores por defecto locales
      setSettings(null);
    }
  }, [profileId]);

  /**
   * Cargar configuración del perfil
   */
  const loadSettings = useCallback(async (): Promise<void> => {
    if (!profileId) {
      setSettings(null);
      return;
    }

    setLoading(true);
    try {
      console.log("📥 Cargando settings para profileId:", profileId);
      const profileSettings =
        await ProfileSettingsService.getProfileSettings(profileId);
      console.log("📊 Settings cargados:", profileSettings);
      setSettings(profileSettings);

      // Auditar carga de configuración (temporalmente deshabilitado por RLS)
      // await auditLogService.logEvent({
      //   event_type: "load_profile_settings",
      //   event_description: "Usuario cargó configuración de personalización",
      //   metadata: {
      //     profile_id: profileId,
      //     settings_found: !!profileSettings,
      //     has_custom_settings: !!profileSettings,
      //   },
      // });
    } catch (error) {
      await logAndShowError(
        "Error cargando configuración de personalización",
        error as Error,
        {
          context: "useProfileSettings.loadSettings",
          profileId,
          action: "load_settings",
        },
      );
    } finally {
      setLoading(false);
    }
  }, [profileId, logAndShowError]);

  /**
   * Actualizar una configuración específica
   */
  const updateSetting = useCallback(
    async <K extends keyof ProfileSettingsInput>(
      key: K,
      value: ProfileSettingsInput[K],
    ): Promise<void> => {
      if (!profileId) {
        console.log("❌ No profileId disponible para guardar setting");
        // Usuario no autenticado, no guardar en DB
        return;
      }

      try {
        console.log(
          "📤 Actualizando setting:",
          key,
          "=",
          value,
          "para profileId:",
          profileId,
        );
        const updatedSettings =
          await ProfileSettingsService.updateProfileSetting(
            profileId,
            key,
            value,
          );
        console.log("✅ Setting actualizado:", updatedSettings);
        setSettings(updatedSettings);

        // Auditar actualización (temporalmente deshabilitado por RLS)
        // await auditLogService.logEvent({
        //   event_type: "update_profile_setting",
        //   event_description: `Usuario actualizó configuración: ${key}`,
        //   metadata: {
        //     profile_id: profileId,
        //     setting_key: key,
        //     new_value: value,
        //     previous_settings: settings,
        //   },
        // });
      } catch (error) {
        await logAndShowError(
          `Error actualizando configuración: ${key}`,
          error as Error,
          {
            context: "useProfileSettings.updateSetting",
            profileId,
            settingKey: key,
            settingValue: value,
          },
        );
      }
    },
    [profileId, settings, logAndShowError],
  );

  /**
   * Actualizar múltiples configuraciones
   */
  const updateSettings = useCallback(
    async (newSettings: ProfileSettingsInput): Promise<void> => {
      if (!profileId) {
        // Usuario no autenticado, no guardar en DB
        return;
      }

      try {
        const updatedSettings =
          await ProfileSettingsService.upsertProfileSettings(
            profileId,
            newSettings,
          );
        setSettings(updatedSettings);

        // Auditar actualización masiva (temporalmente deshabilitado por RLS)
        // await auditLogService.logEvent({
        //   event_type: "update_profile_settings",
        //   event_description: "Usuario actualizó múltiples configuraciones",
        //   metadata: {
        //     profile_id: profileId,
        //     updated_settings: newSettings,
        //     previous_settings: settings,
        //   },
        // });
      } catch (error) {
        await logAndShowError(
          "Error actualizando configuraciones",
          error as Error,
          {
            context: "useProfileSettings.updateSettings",
            profileId,
            newSettings,
          },
        );
      }
    },
    [profileId, settings, logAndShowError],
  );

  /**
   * Resetear configuración a valores por defecto
   */
  const resetSettings = useCallback(async (): Promise<void> => {
    if (!profileId) {
      setSettings(null);
      return;
    }

    try {
      const defaultSettings = ProfileSettingsService.getDefaultSettings();
      const updatedSettings =
        await ProfileSettingsService.upsertProfileSettings(
          profileId,
          defaultSettings,
        );
      setSettings(updatedSettings);

      // Auditar reset (temporalmente deshabilitado por RLS)
      // await auditLogService.logEvent({
      //   event_type: "reset_profile_settings",
      //   event_description: "Usuario restableció configuración por defecto",
      //   metadata: {
      //     profile_id: profileId,
      //     previous_settings: settings,
      //     reset_to_defaults: defaultSettings,
      //   },
      // });
    } catch (error) {
      await logAndShowError(
        "Error restableciendo configuración",
        error as Error,
        {
          context: "useProfileSettings.resetSettings",
          profileId,
        },
      );
    }
  }, [profileId, settings, logAndShowError]);

  // Mappers para compatibilidad con la app existente
  const getFontSizeForApp = useCallback(():
    | "pequenia"
    | "mediana"
    | "grande" => {
    if (!settings) return "mediana";
    return ProfileSettingsService.mapFontSizeToAppSize(settings.font_size);
  }, [settings]);

  const getThemeForApp = useCallback((): boolean => {
    if (!settings) return false;
    return ProfileSettingsService.mapDbThemeToAppTheme(settings.theme);
  }, [settings]);

  const getUppercaseForApp = useCallback((): boolean => {
    if (!settings) return false;
    return settings.uppercase;
  }, [settings]);

  const getLanguageForApp = useCallback((): string => {
    if (!settings) return "es";
    return settings.language;
  }, [settings]);

  return {
    settings,
    loading,
    isAuthenticated,

    // Operaciones CRUD
    updateSetting,
    updateSettings,
    loadSettings,
    resetSettings,

    // Mappers para compatibilidad
    getFontSizeForApp,
    getThemeForApp,
    getUppercaseForApp,
    getLanguageForApp,
  };
};
