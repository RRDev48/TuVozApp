import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { colors } from "../design-system/themes/globalColors-theme";
import { useCurrentUserProfile } from "../feature/ajustes/hooks/useCurrentUserProfile";
import { useProfileSettings } from "../feature/ajustes/hooks/useProfileSettings";
import { ProfileSettingsService } from "../feature/ajustes/services/profileSettings.Service";
import { PersonalizationContextType } from "./(models)/personalization.types";

const PersonalizationContext = createContext<
  PersonalizationContextType | undefined
>(undefined);

const STORAGE_KEYS = {
  SOLO_MAYUSCULAS: "@personalization_soloMayusculas",
  TEMA_OSCURO: "@personalization_temaOscuro",
};

const PersonalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    profileId,
    userId,
    loading: userLoading,
    isAuthenticated,
  } = useCurrentUserProfile();

  const {
    settings,
    loading: settingsLoading,
    updateSetting,
    resetSettings,
    getThemeForApp,
    getUppercaseForApp,
  } = useProfileSettings(profileId || undefined);

  const [localSoloMayusculas, setLocalSoloMayusculasState] = useState(false);
  const [localTemaOscuro, setLocalTemaOscuroState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !userLoading) {
      loadLocalPreferences();
    } else if (isAuthenticated) {
      setLoaded(true);
    }
  }, [isAuthenticated, userLoading]);

  const loadLocalPreferences = async () => {
    try {
      const [mayusculas, temaOscuroValue] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SOLO_MAYUSCULAS),
        AsyncStorage.getItem(STORAGE_KEYS.TEMA_OSCURO),
      ]);

      if (mayusculas !== null)
        setLocalSoloMayusculasState(JSON.parse(mayusculas));
      if (temaOscuroValue !== null)
        setLocalTemaOscuroState(JSON.parse(temaOscuroValue));
    } catch (error) {
    } finally {
      setLoaded(true);
    }
  };

  const setSoloMayusculasAuthenticated = async (value: boolean) => {
    try {
      await updateSetting("uppercase", value);
    } catch (error) {}
  };

  const setTemaOscuroAuthenticated = async (value: boolean) => {
    try {
      const theme = ProfileSettingsService.mapAppThemeToDbTheme(value);
      await updateSetting("theme", theme);
    } catch (error) {}
  };

  const setSoloMayusculasLocal = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SOLO_MAYUSCULAS,
        JSON.stringify(value),
      );
      setLocalSoloMayusculasState(value);
    } catch (error) {}
  };

  const setTemaOscuroLocal = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TEMA_OSCURO,
        JSON.stringify(value),
      );
      setLocalTemaOscuroState(value);
    } catch (error) {}
  };

  const setSoloMayusculas = isAuthenticated
    ? (value: boolean) => {
        return setSoloMayusculasAuthenticated(value);
      }
    : (value: boolean) => {
        return setSoloMayusculasLocal(value);
      };

  const setTemaOscuro = isAuthenticated
    ? (value: boolean) => {
        return setTemaOscuroAuthenticated(value);
      }
    : (value: boolean) => {
        return setTemaOscuroLocal(value);
      };

  const soloMayusculas = isAuthenticated
    ? getUppercaseForApp()
    : localSoloMayusculas;

  const temaOscuro = isAuthenticated ? getThemeForApp() : localTemaOscuro;

  const resetToDefaults = async () => {
    if (isAuthenticated) {
      await resetSettings();
    } else {
      await setSoloMayusculasLocal(false);
      await setTemaOscuroLocal(false);
    }
  };

  const transformText = (text: string): string => {
    return soloMayusculas ? text.toUpperCase() : text;
  };

  const getThemedColors = () => {
    if (temaOscuro) {
      return {
        background: colors.darkBlue,
        cardBackground: colors.white,
        primary: colors.white,
        secondary: colors.secondBlue,
        text: colors.white,
        transparent: colors.transparent,
      };
    } else {
      return {
        background: colors.white,
        cardBackground: colors.blue,
        primary: colors.blue,
        secondary: colors.white,
        text: colors.black,
        transparent: colors.transparent,
      };
    }
  };

  if (userLoading || settingsLoading || !loaded) {
    return null;
  }

  return (
    <PersonalizationContext.Provider
      value={{
        soloMayusculas,
        temaOscuro,
        isAuthenticated,
        currentUserId: userId,
        setSoloMayusculas,
        setTemaOscuro,
        transformText,
        getThemedColors,
        resetToDefaults,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error(
      "usePersonalization must be used within a PersonalizationProvider",
    );
  }
  return context;
};

export default PersonalizationProvider;
