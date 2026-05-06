import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGOUT_CLEANUP_KEYS = [
  "@active_profile",
  "@personalization_soloMayusculas",
  "@personalization_temaOscuro",
  "@personalization_idioma",
  "favorite_pictograms",
  "search_cache",
  "categories_cache",
];

const CACHE_PREFIXES = [
  "pictograms_cache_",
  "cache_metadata_",
];

export const clearAppCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(LOGOUT_CLEANUP_KEYS);

    const allKeys = await AsyncStorage.getAllKeys();
    const keysToRemove = allKeys.filter((key) =>
      CACHE_PREFIXES.some((prefix) => key.startsWith(prefix))
    );

    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
    }
  } catch (error) {
  }
};

export default clearAppCache;