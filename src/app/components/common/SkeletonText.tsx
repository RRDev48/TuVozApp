import React from "react";
import SkeletonLoader from "./SkeletonLoader";

interface SkeletonTextProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginTop?: number;
  marginBottom?: number;
}

const SkeletonText = ({
  width = "60%",
  height = 16,
  borderRadius = 4,
  marginTop = 5,
  marginBottom = 5,
}: SkeletonTextProps) => {
  return (
    <SkeletonLoader 
      width={width as any} 
      height={height} 
      borderRadius={borderRadius} 
      style={{ marginTop, marginBottom }} 
    />
  );
};

export default SkeletonText;
