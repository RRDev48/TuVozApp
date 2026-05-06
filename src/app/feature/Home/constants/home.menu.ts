import i18n from "@/src/app/i18n";
import { HomeMenuItem, HomeScreenMenuItem } from "../models/userData.types";

const homeMenuItems: HomeMenuItem[] = [
  {
    name: i18n.t("expressYourself"),
    component: "Expresate",
    icon: require("../../../assets/icon/Expresate.png"),
  },
  {
    name: i18n.t("routines"),
    component: "Rutinas",
    icon: require("../../../assets/icon/Rutinas.png"),
  },
  {
    name: i18n.t("cards"),
    component: "Tarjetas",
    icon: require("../../../assets/icon/Tarjetas.png"),
  },
  {
    name: i18n.t("phrases"),
    component: "Frases",
    icon: require("../../../assets/icon/Frases.png"),
  },
  {
    name: i18n.t("emergencies"),
    component: "Emergencias",
    icon: require("../../../assets/icon/Emergencias.png"),
  },
  {
    name: i18n.t("settings"),
    component: "Ajustes",
    icon: require("../../../assets/icon/Ajustes.png"),
  },
];

const homeScreenMenu: HomeScreenMenuItem[] = [
  {
    name: i18n.t("profile"),
    icon: require("../../../assets/image/adip_icon.png"),
  },
];

export default { homeMenuItems, homeScreenMenu };
