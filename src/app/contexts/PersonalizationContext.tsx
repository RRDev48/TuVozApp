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
  TAMANIO_LETRA: "@personalization_tamanioLetra",
  TEMA_OSCURO: "@personalization_temaOscuro",
};

const PersonalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Hooks para manejo de usuario y configuración
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
    getFontSizeForApp,
    getThemeForApp,
    getUppercaseForApp,
  } = useProfileSettings(profileId || undefined);

  // Estado local para usuarios no autenticados
  const [localSoloMayusculas, setLocalSoloMayusculasState] = useState(false);
  const [localTamanioLetra, setLocalTamanioLetraState] = useState<
    "pequenia" | "mediana" | "grande"
  >("mediana");
  const [localTemaOscuro, setLocalTemaOscuroState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Cargar preferencias locales para usuarios no autenticados
  useEffect(() => {
    if (!isAuthenticated && !userLoading) {
      loadLocalPreferences();
    } else if (isAuthenticated) {
      setLoaded(true);
    }
  }, [isAuthenticated, userLoading]);

  const loadLocalPreferences = async () => {
    try {
      const [mayusculas, tamanio, temaOscuroValue] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SOLO_MAYUSCULAS),
        AsyncStorage.getItem(STORAGE_KEYS.TAMANIO_LETRA),
        AsyncStorage.getItem(STORAGE_KEYS.TEMA_OSCURO),
      ]);

      if (mayusculas !== null)
        setLocalSoloMayusculasState(JSON.parse(mayusculas));
      if (tamanio !== null) setLocalTamanioLetraState(JSON.parse(tamanio));
      if (temaOscuroValue !== null)
        setLocalTemaOscuroState(JSON.parse(temaOscuroValue));
    } catch (error) {
      // Error cargando preferencias locales
    } finally {
      setLoaded(true);
    }
  };

  // Funciones para usuarios autenticados
  const setSoloMayusculasAuthenticated = async (value: boolean) => {
    try {
      await updateSetting("uppercase", value);
    } catch (error) {}
  };

  const setTamanioLetraAuthenticated = async (
    value: "pequenia" | "mediana" | "grande",
  ) => {
    try {
      const fontSize = ProfileSettingsService.mapAppSizeToFontSize(value);
      await updateSetting("font_size", fontSize);
    } catch (error) {}
  };

  const setTemaOscuroAuthenticated = async (value: boolean) => {
    try {
      const theme = ProfileSettingsService.mapAppThemeToDbTheme(value);
      await updateSetting("theme", theme);
    } catch (error) {}
  };

  // Funciones para usuarios no autenticados (AsyncStorage)
  const setSoloMayusculasLocal = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SOLO_MAYUSCULAS,
        JSON.stringify(value),
      );
      setLocalSoloMayusculasState(value);
    } catch (error) {
      // Error guardando preferencia local
    }
  };

  const setTamanioLetraLocal = async (
    value: "pequenia" | "mediana" | "grande",
  ) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TAMANIO_LETRA,
        JSON.stringify(value),
      );
      setLocalTamanioLetraState(value);
    } catch (error) {
      // Error guardando preferencia local
    }
  };

  const setTemaOscuroLocal = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TEMA_OSCURO,
        JSON.stringify(value),
      );
      setLocalTemaOscuroState(value);
    } catch (error) {
      // Error guardando preferencia local
    }
  };

  // Funciones unificadas que eligen entre DB o AsyncStorage
  const setSoloMayusculas = isAuthenticated
    ? (value: boolean) => {
        return setSoloMayusculasAuthenticated(value);
      }
    : (value: boolean) => {
        return setSoloMayusculasLocal(value);
      };

  const setTamanioLetra = isAuthenticated
    ? (value: "pequenia" | "mediana" | "grande") => {
        return setTamanioLetraAuthenticated(value);
      }
    : (value: "pequenia" | "mediana" | "grande") => {
        return setTamanioLetraLocal(value);
      };

  const setTemaOscuro = isAuthenticated
    ? (value: boolean) => {
        return setTemaOscuroAuthenticated(value);
      }
    : (value: boolean) => {
        return setTemaOscuroLocal(value);
      };

  // Valores actuales (desde DB o AsyncStorage)
  const soloMayusculas = isAuthenticated
    ? getUppercaseForApp()
    : localSoloMayusculas;

  const tamanioLetra = isAuthenticated
    ? getFontSizeForApp()
    : localTamanioLetra;

  const temaOscuro = isAuthenticated ? getThemeForApp() : localTemaOscuro;

  // Función para resetear a valores por defecto
  const resetToDefaults = async () => {
    if (isAuthenticated) {
      await resetSettings();
    } else {
      // Resetear valores locales
      await setSoloMayusculasLocal(false);
      await setTamanioLetraLocal("mediana");
      await setTemaOscuroLocal(false);
    }
  };

  // Obtener tamaño de fuente basado en el tamaño base
  const getFontSize = (baseSize: number): number => {
    switch (tamanioLetra) {
      case "pequenia":
        return 12;
      case "grande":
        return 22;
      default:
        return 16;
    }
  };

  // Transformar texto según preferencias
  const transformText = (text: string): string => {
    return soloMayusculas ? text.toUpperCase() : text;
  };

  // Obtener colores del tema
  const getThemedColors = () => {
    if (temaOscuro) {
      return {
        background: colors.darkBlue, // azul oscuro
        cardBackground: colors.white, // blanco
        primary: colors.white, // blanco
        secondary: colors.secondBlue, // gris claro
        text: colors.white, // blanco
        transparent: colors.transparent,
      };
    } else {
      return {
        background: colors.white, // blanco
        cardBackground: colors.blue, // azul
        primary: colors.blue, // azul
        secondary: colors.white, // gris claro
        text: colors.black, // negro
        transparent: colors.transparent,
      };
    }
  };

  // Esperar a que cargue la configuración
  if (userLoading || settingsLoading || !loaded) {
    return null;
  }

  return (
    <PersonalizationContext.Provider
      value={{
        soloMayusculas,
        tamanioLetra,
        temaOscuro,
        isAuthenticated,
        currentUserId: userId,
        setSoloMayusculas,
        setTamanioLetra,
        setTemaOscuro,
        getFontSize,
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
