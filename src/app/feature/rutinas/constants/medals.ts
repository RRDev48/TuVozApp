import { ImageSourcePropType } from "react-native";
import { Medal } from "../models/routine.types";

export const medalImages: Record<Medal, ImageSourcePropType | undefined> = {
  bronce: require("../../../assets/medals/bronce.png"),
  plata: require("../../../assets/medals/plata.png"),
  oro: require("../../../assets/medals/oro.png"),
  none: undefined,
};

export default medalImages;
