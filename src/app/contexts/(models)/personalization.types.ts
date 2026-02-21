export interface PersonalizationContextType {
  soloMayusculas: boolean;
  temaOscuro: boolean;
  isAuthenticated: boolean;
  currentUserId: string | null;
  setSoloMayusculas: (value: boolean) => void;
  setTemaOscuro: (value: boolean) => void;
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
