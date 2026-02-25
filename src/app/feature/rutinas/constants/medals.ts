import { Medal } from "../models/routine.types";

export const medalImages: Record<Medal, any> = {
  bronce: require("../../../assets/medals/bronce.png"),
  plata: require("../../../assets/medals/plata.png"),
  oro: require("../../../assets/medals/oro.png"),
  none: undefined,
};

export default medalImages;
