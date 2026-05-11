import { createNavigationContainerRef } from "@react-navigation/native";
import RootStackParamsList from "./navigation.types";

export const navigationRef = createNavigationContainerRef<RootStackParamsList>();

export function navigate(name: keyof RootStackParamsList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params);
  }
}
