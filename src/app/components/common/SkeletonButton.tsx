import React from "react";
import { ViewStyle } from "react-native";
import SkeletonLoader from "./SkeletonLoader";

interface SkeletonButtonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonButton = ({
  width = "100%",
  height = 48,
  borderRadius = 12,
  style,
}: SkeletonButtonProps) => {
  return (
    <SkeletonLoader 
      width={width as any} 
      height={height} 
      borderRadius={borderRadius} 
      style={style} 
    />
  );
};

export default SkeletonButton;
