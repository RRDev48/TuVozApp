import React from "react";
import SkeletonLoader from "./SkeletonLoader";

interface SkeletonAvatarProps {
  size?: number;
}

const SkeletonAvatar = ({ size = 60 }: SkeletonAvatarProps) => {
  return (
    <SkeletonLoader 
      width={size} 
      height={size} 
      circle 
    />
  );
};

export default SkeletonAvatar;
