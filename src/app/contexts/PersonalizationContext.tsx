import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { colors } from "../design-system/themes/globalColors-theme";

interface PersonalizationContextType {
  soloMayusculas: boolean;
  tamanioLetra: "pequenia" | "mediana" | "grande";
  temaOscuro: boolean;
  setSoloMayusculas: (value: boolean) => void;
  setTamanioLetra: (value: "pequenia" | "mediana" | "grande") => void;
  setTemaOscuro: (value: boolean) => void;
  getFontSize: (baseSize: number) => number;
  transformText: (text: string) => string;
  getThemedColors: () => {
    background: string;
    primary: string;
    secondary: string;
    text: string;
    cardBackground: string;
    transparent: string;
  };
}

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
  const [soloMayusculas, setSoloMayusculasState] = useState(false);
  const [tamanioLetra, setTamanioLetraState] = useState<
    "pequenia" | "mediana" | "grande"
  >("mediana");
  const [temaOscuro, setTemaOscuroState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Cargar preferencias al iniciar
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [mayusculas, tamanio, temaOscuroValue] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SOLO_MAYUSCULAS),
        AsyncStorage.getItem(STORAGE_KEYS.TAMANIO_LETRA),
        AsyncStorage.getItem(STORAGE_KEYS.TEMA_OSCURO),
      ]);

      if (mayusculas !== null) setSoloMayusculasState(JSON.parse(mayusculas));
      if (tamanio !== null) setTamanioLetraState(JSON.parse(tamanio));
      if (temaOscuroValue !== null)
        setTemaOscuroState(JSON.parse(temaOscuroValue));
    } catch (error) {
      // Error cargando preferencias
    } finally {
      setLoaded(true);
    }
  };

  const setSoloMayusculas = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SOLO_MAYUSCULAS,
        JSON.stringify(value),
      );
      setSoloMayusculasState(value);
    } catch (error) {
      // Error guardando preferencia
    }
  };

  const setTamanioLetra = async (value: "pequenia" | "mediana" | "grande") => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TAMANIO_LETRA,
        JSON.stringify(value),
      );
      setTamanioLetraState(value);
    } catch (error) {
      // Error guardando preferencia
    }
  };

  const setTemaOscuro = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TEMA_OSCURO,
        JSON.stringify(value),
      );
      setTemaOscuroState(value);
    } catch (error) {
      // Error guardando preferencia
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

  if (!loaded) {
    return null;
  }

  return (
    <PersonalizationContext.Provider
      value={{
        soloMayusculas,
        tamanioLetra,
        temaOscuro,
        setSoloMayusculas,
        setTamanioLetra,
        setTemaOscuro,
        getFontSize,
        transformText,
        getThemedColors,
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
