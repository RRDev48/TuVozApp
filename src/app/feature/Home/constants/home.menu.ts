import { HomeMenuItem, HomeScreenMenuItem } from "../models/userData.types";

export const HOME_MENU_KEYS = {
  EXPRESS_YOURSELF: "expressYourself",
  ROUTINES: "routines",
  CARDS: "cards",
  PHRASES: "phrases",
  EMERGENCIES: "emergencies",
  SETTINGS: "settings",
  PROFILE: "profile",
} as const;

const homeMenuItems: HomeMenuItem[] = [
  {
    nameKey: HOME_MENU_KEYS.EXPRESS_YOURSELF,
    component: "Expresate",
    icon: require("../../../assets/icon/Expresate.png"),
  },
  {
    nameKey: HOME_MENU_KEYS.ROUTINES,
    component: "Rutinas",
    icon: require("../../../assets/icon/Rutinas.png"),
  },
  {
    nameKey: HOME_MENU_KEYS.CARDS,
    component: "Tarjetas",
    icon: require("../../../assets/icon/Tarjetas.png"),
  },
  {
    nameKey: HOME_MENU_KEYS.PHRASES,
    component: "Frases",
    icon: require("../../../assets/icon/Frases.png"),
  },
  {
    nameKey: HOME_MENU_KEYS.EMERGENCIES,
    component: "Emergencias",
    icon: require("../../../assets/icon/Emergencias.png"),
  },
  {
    nameKey: HOME_MENU_KEYS.SETTINGS,
    component: "Ajustes",
    icon: require("../../../assets/icon/Ajustes.png"),
  },
];

const homeScreenMenu: HomeScreenMenuItem[] = [
  {
    nameKey: HOME_MENU_KEYS.PROFILE,
    icon: require("../../../assets/image/adip_icon.png"),
  },
];

export default { homeMenuItems, homeScreenMenu };
