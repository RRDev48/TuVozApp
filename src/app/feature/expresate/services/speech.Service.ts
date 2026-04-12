import * as Speech from "expo-speech";
import { Platform } from "react-native";

let cachedVoices: Speech.Voice[] | null = null;

function normalizeLanguage(language: string) {
  return language === "es" ? "es-ES" : language;
}

async function getVoiceOptions(language: string) {
  const normalizedLanguage = normalizeLanguage(language);

  try {
    if (!cachedVoices) {
      cachedVoices = await Speech.getAvailableVoicesAsync();
    }

    const exactVoice = cachedVoices.find(
      (voice) =>
        voice.language.toLowerCase() === normalizedLanguage.toLowerCase(),
    );

    if (exactVoice) {
      return {
        language: exactVoice.language,
        voice: exactVoice.identifier,
      };
    }

    const baseLanguage = normalizedLanguage.split("-")[0]?.toLowerCase();
    const fallbackVoice = cachedVoices.find((voice) =>
      voice.language.toLowerCase().startsWith(baseLanguage),
    );

    if (fallbackVoice) {
      return {
        language: fallbackVoice.language,
        voice: fallbackVoice.identifier,
      };
    }
  } catch {
    return { language: normalizedLanguage };
  }

  return { language: normalizedLanguage };
}

export async function speakPictogramText(text: string, language: string) {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return;
  }

  const voiceOptions = await getVoiceOptions(language);

  try {
    const isSpeaking = await Speech.isSpeakingAsync();

    if (isSpeaking) {
      await Speech.stop();
    }
  } catch {}

  Speech.speak(normalizedText, {
    ...voiceOptions,
    pitch: 1,
    rate: 0.9,
    volume: 1,
    ...(Platform.OS === "ios" ? { useApplicationAudioSession: false } : {}),
    onError: () => {
      Speech.speak(normalizedText, {
        pitch: 1,
        rate: 0.9,
        volume: 1,
      });
    },
  });
}
