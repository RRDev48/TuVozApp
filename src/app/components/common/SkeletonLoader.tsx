import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle, DimensionValue } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { usePersonalization } from "../../contexts/PersonalizationContext";
import { colors } from "../../design-system/themes/globalColors-theme";

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  circle?: boolean;
}

const SkeletonLoader = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
  circle = false,
}: SkeletonLoaderProps) => {
  const { temaOscuro } = usePersonalization();
  const shimmerValue = useSharedValue(0);

  const baseColor = temaOscuro ? colors.skeletonDark : colors.skeletonLight;
  const highlightColor = temaOscuro 
    ? "rgba(255, 255, 255, 0.05)" 
    : "rgba(255, 255, 255, 0.4)";

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerValue.value,
      [0, 1],
      [-150, 150]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const containerStyle: ViewStyle = {
    width,
    height,
    borderRadius: circle ? (typeof height === 'number' ? height / 2 : 50) : borderRadius,
    backgroundColor: baseColor,
    overflow: "hidden",
    ...style,
  };

  return (
    <View style={containerStyle}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: highlightColor,
            width: "50%",
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

export default SkeletonLoader;
