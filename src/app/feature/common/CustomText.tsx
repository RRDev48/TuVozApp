import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React from "react";
import { Text as RNText, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  disablePersonalization?: boolean;
}

export const CustomText = ({
  children,
  style,
  disablePersonalization = false,
  ...props
}: CustomTextProps) => {
  const { transformText, languageRefresh } = usePersonalization();

  if (disablePersonalization) {
    return (
      <RNText style={style} {...props}>
        {children}
      </RNText>
    );
  }

  const transformedChildren =
    typeof children === "string" ? transformText(children) : children;

  return (
    <RNText style={style} {...props}>
      {transformedChildren}
    </RNText>
  );
};

export default CustomText;
