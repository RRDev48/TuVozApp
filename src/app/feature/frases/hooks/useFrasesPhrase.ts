import { Pictogram } from "@/src/app/feature/expresate/models/pictogram.types";
import { speakPictogramText } from "@/src/app/feature/expresate/services/speech.Service";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";

export const useFrasesPhrase = () => {
  const MAX_PICTOGRAMS = 6;
  const [selectedPictograms, setSelectedPictograms] = useState<Pictogram[]>([]);

  const addPictogram = useCallback((pictogram: Pictogram) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPictograms((prev) => {
      if (prev.length >= MAX_PICTOGRAMS) {
        return prev;
      }

      return [...prev, pictogram];
    });
  }, []);

  const removeLastPictogram = useCallback(() => {
    setSelectedPictograms((prev) => prev.slice(0, -1));
  }, []);

  const speakPhrase = useCallback(async () => {
    if (selectedPictograms.length === 0) return;
    const phrase = selectedPictograms.map((p) => p.keyword).join(" ");
    const language = selectedPictograms[0]?.language ?? "es";
    await speakPictogramText(phrase, language);
  }, [selectedPictograms]);

  return {
    selectedPictograms,
    addPictogram,
    removeLastPictogram,
    speakPhrase,
  };
};
