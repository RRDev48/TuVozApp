import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { colors } from "../design-system/themes/globalColors-theme";
import { useCurrentUserProfile } from "../feature/ajustes/hooks/useCurrentUserProfile";
import { useProfileSettings } from "../feature/ajustes/hooks/useProfileSettings";
import { ProfileSettingsService } from "../feature/ajustes/services/profileSettings.Service";
import { Language, PersonalizationContextType } from "./models/personalization.types";
import { changeLanguage } from "../i18n";

const PersonalizationContext = createContext<
  PersonalizationContextType | undefined
>(undefined);

const STORAGE_KEYS = {
  SOLO_MAYUSCULAS: "@personalization_soloMayusculas",
  TEMA_OSCURO: "@personalization_temaOscuro",
  IDIOMA: "@personalization_idioma",
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

  const hasProfile = !!profileId;

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
  const [localIdioma, setLocalIdiomaState] = useState<Language>("es");
  const [idiomaCargando, setIdiomaCargando] = useState(false);
  const [languageRefresh, setLanguageRefresh] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!hasProfile && !userLoading) {
      loadLocalPreferences();
    } else if (hasProfile) {
      setLoaded(true);
    }
  }, [hasProfile, userLoading]);

  const loadLocalPreferences = async () => {
    try {
      const [mayusculas, temaOscuroValue, idiomaValue] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SOLO_MAYUSCULAS),
        AsyncStorage.getItem(STORAGE_KEYS.TEMA_OSCURO),
        AsyncStorage.getItem(STORAGE_KEYS.IDIOMA),
      ]);

      if (mayusculas !== null)
        setLocalSoloMayusculasState(JSON.parse(mayusculas));
      else setLocalSoloMayusculasState(false);

      if (temaOscuroValue !== null)
        setLocalTemaOscuroState(JSON.parse(temaOscuroValue));
      else setLocalTemaOscuroState(false);

      if (idiomaValue !== null) {
        const parsedIdioma = JSON.parse(idiomaValue) as Language;
        setLocalIdiomaState(parsedIdioma);
        await changeLanguage(parsedIdioma);
      } else {
        setLocalIdiomaState("es");
        await changeLanguage("es");
      }
    } catch (error) {
    } finally {
      setLoaded(true);
    }
  };

  const setSoloMayusculasAuthenticated = async (value: boolean) => {
    try {
      await updateSetting("uppercase", value);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SOLO_MAYUSCULAS,
        JSON.stringify(value),
      );
      setLocalSoloMayusculasState(value);
    } catch (error) {}
  };

  const setTemaOscuroAuthenticated = async (value: boolean) => {
    try {
      const theme = ProfileSettingsService.mapAppThemeToDbTheme(value);
      await updateSetting("theme", theme);
      await AsyncStorage.setItem(
        STORAGE_KEYS.TEMA_OSCURO,
        JSON.stringify(value),
      );
      setLocalTemaOscuroState(value);
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

  const setIdioma = async (value: Language) => {
    try {
      setIdiomaCargando(true);
      await AsyncStorage.setItem(STORAGE_KEYS.IDIOMA, JSON.stringify(value));
      setLocalIdiomaState(value);
      await changeLanguage(value);
      setLanguageRefresh((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
    } finally {
      setIdiomaCargando(false);
    }
  };

  const setSoloMayusculas = hasProfile
    ? (value: boolean) => {
        return setSoloMayusculasAuthenticated(value);
      }
    : (value: boolean) => {
        return setSoloMayusculasLocal(value);
      };

  const setTemaOscuro = hasProfile
    ? (value: boolean) => {
        return setTemaOscuroAuthenticated(value);
      }
    : (value: boolean) => {
        return setTemaOscuroLocal(value);
      };

  const soloMayusculas = hasProfile
    ? getUppercaseForApp()
    : localSoloMayusculas;

  const temaOscuro = hasProfile ? getThemeForApp() : localTemaOscuro;

  const idioma = localIdioma;

  const resetToDefaults = async () => {
    if (hasProfile) {
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
        idioma,
        idiomaCargando,
        languageRefresh,
        isAuthenticated,
        currentUserId: userId,
        setSoloMayusculas,
        setTemaOscuro,
        setIdioma,
        transformText,
        getThemedColors,
        resetToDefaults,
        reloadLocalPreferences: loadLocalPreferences,
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
