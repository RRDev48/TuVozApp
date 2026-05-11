import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import SkeletonLoader from "./SkeletonLoader";

interface SkeletonCardProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonCard = ({
  width = 130,
  height = 130,
  borderRadius = 30,
  style,
}: SkeletonCardProps) => {
  return (
    <View style={[styles.container, style]}>
      <SkeletonLoader width={width} height={height} borderRadius={borderRadius} />
      <View style={styles.textContainer}>
        <SkeletonLoader width={width * 0.8} height={16} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  textContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default SkeletonCard;
