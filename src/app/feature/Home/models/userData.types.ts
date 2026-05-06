import type RootStackParamsList from "@/src/app/navigation/navigation.types";
import type { ImageSourcePropType } from "react-native";

export type HomeRouteName = Extract<
  keyof RootStackParamsList,
  "Expresate" | "Rutinas" | "Tarjetas" | "Frases" | "Emergencias" | "Ajustes"
>;

export interface HomeMenuItem {
  name: string;
  nameKey?: string;
  component: HomeRouteName;
  icon: ImageSourcePropType;
}

export interface HomeScreenMenuItem {
  name?: string;
  nameKey?: string;
  icon: ImageSourcePropType;
}

export interface UseUserDataReturn {
  userName: string | null;
  avatarUrl: string | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}
