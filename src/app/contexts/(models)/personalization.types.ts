// Interface del contexto de personalización
export interface PersonalizationContextType {
  soloMayusculas: boolean;
  tamanioLetra: "pequenia" | "mediana" | "grande";
  temaOscuro: boolean;
  isAuthenticated: boolean;
  currentUserId: string | null;
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
  resetToDefaults: () => Promise<void>;
}
