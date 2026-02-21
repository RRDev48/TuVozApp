import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React from "react";
import { Text as RNText, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  disablePersonalization?: boolean;
}

/**
 * Componente Text personalizado que aplica automáticamente las preferencias de personalización
 * (mayúsculas)
 */
export const CustomText = ({
  children,
  style,
  disablePersonalization = false,
  ...props
}: CustomTextProps) => {
  const { transformText } = usePersonalization();

  // Si la personalización está deshabilitada, renderizar texto normal
  if (disablePersonalization) {
    return (
      <RNText style={style} {...props}>
        {children}
      </RNText>
    );
  }

  // Transformar el texto si es string
  const transformedChildren =
    typeof children === "string" ? transformText(children) : children;

  return (
    <RNText style={style} {...props}>
      {transformedChildren}
    </RNText>
  );
};

export default CustomText;
