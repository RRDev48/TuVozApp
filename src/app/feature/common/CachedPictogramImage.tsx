import { Image as ExpoImage, ImageContentFit } from "expo-image";
import React from "react";
import { ImageSourcePropType, ImageStyle, StyleProp } from "react-native";

const ARASAAC_BASE_URL = "https://api.arasaac.org/v1/pictograms";

type CachedPictogramImageProps = {
  arasaacId: string;
  style?: StyleProp<ImageStyle>;
  placeholder?: ImageSourcePropType;
  contentFit?: ImageContentFit;
};

const CachedPictogramImage = ({
  arasaacId,
  style,
  placeholder,
  contentFit = "contain",
}: CachedPictogramImageProps) => {
  return (
    <ExpoImage
      source={{ uri: `${ARASAAC_BASE_URL}/${arasaacId}` }}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      transition={120}
      placeholder={placeholder}
      recyclingKey={arasaacId}
    />
  );
};

export default CachedPictogramImage;
