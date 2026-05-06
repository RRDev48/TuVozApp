import { Image as ExpoImage } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface OptimizedGifProps {
  source: number;
  style?: object;
}

const OptimizedGif = ({ source, style }: OptimizedGifProps) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          overflow: "hidden",
        },
        gif: {
          width: "100%",
          height: "100%",
        },
      }),
    [],
  );

  return (
    <View style={[styles.container, style]}>
      <ExpoImage
        source={source}
        style={styles.gif}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    </View>
  );
};

export default OptimizedGif;