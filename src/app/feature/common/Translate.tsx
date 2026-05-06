import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useTranslation } from "react-i18next";
import React from "react";
import { Text as RNText, TextProps } from "react-native";

interface TranslateProps extends TextProps {
  children?: React.ReactNode;
}

export const Translate: React.FC<TranslateProps> = ({
  children,
  style,
  ...props
}) => {
  const { t } = useTranslation();
  const { languageRefresh, transformText } = usePersonalization();

  const translatedText = typeof children === "string" ? t(children) : children;
  const transformedText =
    typeof translatedText === "string" ? transformText(translatedText) : translatedText;

  return (
    <RNText style={style} {...props}>
      {transformedText}
    </RNText>
  );
};

export default Translate;