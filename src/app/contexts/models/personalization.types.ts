export type Language = "es" | "en";

export interface PersonalizationContextType {
  soloMayusculas: boolean;
  temaOscuro: boolean;
  idioma: Language;
  idiomaCargando: boolean;
  languageRefresh: number;
  isAuthenticated: boolean;
  currentUserId: string | null;
  setSoloMayusculas: (value: boolean) => void;
  setTemaOscuro: (value: boolean) => void;
  setIdioma: (value: Language) => Promise<void>;
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
  reloadLocalPreferences: () => Promise<void>;
}
