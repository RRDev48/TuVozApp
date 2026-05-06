import { Image as ExpoImage, ImageContentFit } from "expo-image";
import React, { useEffect, useState } from "react";
import { ImageSourcePropType, ImageStyle, StyleProp, View as RNView } from "react-native";

const ARASAAC_BASE_URL = "https://api.arasaac.org/v1/pictograms";

type CachedPictogramImageProps = {
  arasaacId: string;
  style?: StyleProp<ImageStyle>;
  placeholder?: ImageSourcePropType;
  contentFit?: ImageContentFit;
  priority?: "high" | "normal" | "low";
};

const CachedPictogramImage: React.FC<CachedPictogramImageProps> = ({
  arasaacId,
  style,
  placeholder,
  contentFit = "contain",
  priority = "normal",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    const imageUri = `${ARASAAC_BASE_URL}/${arasaacId}`;
    setUri(imageUri);

    if (priority === "high") {
      ExpoImage.prefetch(imageUri).catch(() => {});
    }
  }, [arasaacId, priority]);

  return (
    <RNView style={style}>
      <ExpoImage
        source={uri ? { uri } : undefined}
        style={style}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        transition={120}
        placeholder={placeholder}
        recyclingKey={arasaacId}
        onLoadEnd={() => setIsLoaded(true)}
      />
    </RNView>
  );
};

export default CachedPictogramImage;