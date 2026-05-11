import { Pictogram } from "@/src/app/feature/expresate/models/pictogram.types";
import { speakPictogramText } from "@/src/app/feature/expresate/services/speech.Service";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";

const PHRASE_STEP_DELAY_MS = 450;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

    for (let index = 0; index < selectedPictograms.length; index += 1) {
      const pictogram = selectedPictograms[index];
      const language = pictogram?.language ?? "es";

      await speakPictogramText(pictogram.keyword, language, {
        awaitCompletion: true,
        interruptCurrent: index === 0,
      });

      if (index < selectedPictograms.length - 1) {
        await wait(PHRASE_STEP_DELAY_MS);
      }
    }
  }, [selectedPictograms]);

  const clearPhrase = useCallback(() => {
    setSelectedPictograms([]);
  }, []);

  return {
    selectedPictograms,
    addPictogram,
    removeLastPictogram,
    speakPhrase,
    clearPhrase,
  };
};
