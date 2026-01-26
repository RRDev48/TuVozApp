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
    text: string;
    cardBackground: string;
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
      console.error("Error loading personalization preferences:", error);
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
      console.error("Error saving soloMayusculas:", error);
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
      console.error("Error saving tamanioLetra:", error);
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
      console.error("Error saving temaOscuro:", error);
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
        primary: colors.white, // blanco
        text: colors.white, // blanco
        cardBackground: colors.white, // blanco
      };
    } else {
      return {
        background: colors.white, // blanco
        primary: colors.blue, // azul
        text: colors.black, // negro
        cardBackground: colors.blue, // azul
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
