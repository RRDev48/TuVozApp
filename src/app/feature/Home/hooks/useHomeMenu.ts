import { useMemo } from "react";
import homeMenu from "../constants/home.menu";
import { HomeRouteName } from "../models/userData.types";

const guestBlockedRoutes = new Set<HomeRouteName>(["Emergencias", "Rutinas"]);

export const useHomeMenu = (isAuthenticated: boolean) => {
  return useMemo(() => {
    if (isAuthenticated) {
      return homeMenu.homeMenuItems;
    }

    return homeMenu.homeMenuItems.filter(
      (item) => !guestBlockedRoutes.has(item.component),
    );
  }, [isAuthenticated]);
};
