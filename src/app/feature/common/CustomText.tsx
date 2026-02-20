import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  disablePersonalization?: boolean;
}

/**
 * Componente Text personalizado que aplica automáticamente las preferencias de personalización
 * (mayúsculas, tamaño de letra y fuente para dislexia)
 */
export const CustomText = ({
  children,
  style,
  disablePersonalization = false,
  ...props
}: CustomTextProps) => {
  const { transformText, getFontSize, soloMayusculas } = usePersonalization();

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

  // Extraer fontSize base del estilo
  let baseFontSize = 14;
  if (style) {
    const styleArray = Array.isArray(style) ? style : [style];
    for (const s of styleArray) {
      if (s && typeof s === "object" && "fontSize" in s && s.fontSize) {
        baseFontSize = s.fontSize as number;
        break;
      }
    }
  }

  // Aplicar transformaciones de personalización
  const customStyle: TextStyle = {
    fontSize: getFontSize(baseFontSize),
  };

  return (
    <RNText style={[style, customStyle]} {...props}>
      {transformedChildren}
    </RNText>
  );
};

export default CustomText;
