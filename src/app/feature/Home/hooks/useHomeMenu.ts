import { useMemo } from "react";
import homeMenu from "../constants/home.menu";

export const useHomeMenu = (isAuthenticated: boolean) => {
  return useMemo(() => {
    if (isAuthenticated) {
      return homeMenu.homeMenuItems;
    }
    // Ocultar Emergencias y Rutinas si no está autenticado
    return homeMenu.homeMenuItems.filter(
      (item) => item.name !== "Emergencias" && item.name !== "Rutinas",
    );
  }, [isAuthenticated]);
};
