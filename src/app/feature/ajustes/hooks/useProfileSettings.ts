import { useCallback, useEffect, useState } from "react";
import {
  ProfileSettings,
  ProfileSettingsInput,
  ProfileSettingsService,
} from "../services/profileSettings.Service";
import { useErrorHandling } from "./useErrorHandling";

export interface UseProfileSettingsReturn {
  settings: ProfileSettings | null;
  loading: boolean;
  isAuthenticated: boolean;

  updateSetting: <K extends keyof ProfileSettingsInput>(
    key: K,
    value: ProfileSettingsInput[K],
  ) => Promise<void>;
  updateSettings: (settings: ProfileSettingsInput) => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;

  getThemeForApp: () => boolean;
  getUppercaseForApp: () => boolean;
  getLanguageForApp: () => string;
}

export const useProfileSettings = (profileId?: string) => {
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { logAndShowError } = useErrorHandling();

  useEffect(() => {
    setIsAuthenticated(!!profileId);
    if (profileId) {
      loadSettings();
    } else {
      setSettings(null);
    }
  }, [profileId]);

  const loadSettings = useCallback(async (): Promise<void> => {
    if (!profileId) {
      setSettings(null);
      return;
    }

    setLoading(true);
    try {
      const profileSettings =
        await ProfileSettingsService.getProfileSettings(profileId);
      setSettings(profileSettings);
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

  const updateSetting = useCallback(
    async <K extends keyof ProfileSettingsInput>(
      key: K,
      value: ProfileSettingsInput[K],
    ): Promise<void> => {
      if (!profileId) {
        return;
      }

      try {
        const updatedSettings =
          await ProfileSettingsService.updateProfileSetting(
            profileId,
            key,
            value,
          );
        setSettings(updatedSettings);
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

  const updateSettings = useCallback(
    async (newSettings: ProfileSettingsInput): Promise<void> => {
      if (!profileId) {
        return;
      }

      try {
        const updatedSettings =
          await ProfileSettingsService.upsertProfileSettings(
            profileId,
            newSettings,
          );
        setSettings(updatedSettings);
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
    return "es";
  }, [settings]);

  return {
    settings,
    loading,
    isAuthenticated,

    updateSetting,
    updateSettings,
    loadSettings,
    resetSettings,

    getThemeForApp,
    getUppercaseForApp,
    getLanguageForApp,
  };
};
