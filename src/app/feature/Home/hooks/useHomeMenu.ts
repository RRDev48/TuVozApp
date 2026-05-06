import { useMemo } from "react";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import homeMenu from "../constants/home.menu";
import { HomeMenuItem, HomeRouteName } from "../models/userData.types";

const guestBlockedRoutes = new Set<HomeRouteName>(["Emergencias", "Rutinas"]);

export const useHomeMenu = (isAuthenticated: boolean) => {
  const { t } = useLanguageRefresh();

  return useMemo(() => {
    const baseItems = isAuthenticated
      ? homeMenu.homeMenuItems
      : homeMenu.homeMenuItems.filter(
          (item) => !guestBlockedRoutes.has(item.component),
        );

    return baseItems.map((item): HomeMenuItem => ({
      ...item,
      name: item.nameKey ? t(item.nameKey) : (item.name || ""),
    }));
  }, [isAuthenticated, t]);
};
