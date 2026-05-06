import { useTranslation } from "react-i18next";
import { usePersonalization } from "./PersonalizationContext";
import { useEffect, useState } from "react";
import i18n from "../i18n";

export const useLanguageRefresh = () => {
  const { t } = useTranslation();
  const { languageRefresh } = usePersonalization();
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setTick((prev) => prev + 1);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return { t };
};