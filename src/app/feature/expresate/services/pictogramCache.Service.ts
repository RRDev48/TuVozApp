import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pictogram } from "../models/pictogram.types";

const CACHE_METADATA_KEY = "pictogram_cache_metadata";
const FAVORITE_PICTOGRAMS_KEY = "favorite_pictograms_offline";
const CATEGORIES_KEY = "pictogram_categories_offline";
const PICTOGRAMS_KEY = "pictograms_by_category_offline";

type CacheMetadata = {
  lastUpdated: number;
  version: string;
  cachedPictogramIds: string[];
  cachedCategoryIds: string[];
};

type PictogramCacheData = {
  categories: string[];
  pictograms: Pictogram[];
  lastFetched: number;
};

class PictogramCacheService {
  private static instance: PictogramCacheService;
  private metadata: CacheMetadata | null = null;
  private readonly CACHE_VERSION = "1.0.0";
  private readonly MAX_CACHE_SIZE_MB = 50;
  private readonly CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

  private constructor() {}

  static getInstance(): PictogramCacheService {
    if (!PictogramCacheService.instance) {
      PictogramCacheService.instance = new PictogramCacheService();
    }
    return PictogramCacheService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(CACHE_METADATA_KEY);
      if (stored) {
        this.metadata = JSON.parse(stored);
      }
    } catch (error) {
      this.metadata = null;
    }
  }

  async getCacheMetadata(): Promise<CacheMetadata | null> {
    if (!this.metadata) {
      await this.initialize();
    }
    return this.metadata;
  }

  isCacheValid(): boolean {
    if (!this.metadata) return false;
    const cacheAge = Date.now() - this.metadata.lastUpdated;
    return cacheAge < this.CACHE_EXPIRY_MS;
  }

  async cacheCategories(categories: { id: string; name: string; slug: string; image_url?: string }[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      await this.updateMetadata((meta) => ({
        ...meta,
        cachedCategoryIds: categories.map((c) => c.id),
      }));
    } catch (error) {
      console.error("Error caching categories:", error);
    }
  }

  async getCachedCategories(): Promise<{ id: string; name: string; slug: string; image_url?: string }[] | null> {
    try {
      const data = await AsyncStorage.getItem(CATEGORIES_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting cached categories:", error);
      return null;
    }
  }

  async cachePictograms(categoryId: string, pictograms: Pictogram[]): Promise<void> {
    try {
      const existing = await this.getCachedPictogramsByCategory(categoryId);
      const merged = existing
        ? [...existing, ...pictograms.filter((p) => !existing.find((e) => e.id === p.id))]
        : pictograms;

      const cacheData: PictogramCacheData = {
        categories: [categoryId],
        pictograms: merged,
        lastFetched: Date.now(),
      };

      await AsyncStorage.setItem(`${PICTOGRAMS_KEY}_${categoryId}`, JSON.stringify(cacheData));

      const allIds = [...(this.metadata?.cachedPictogramIds || []), ...pictograms.map((p) => p.id)];
      const uniqueIds = [...new Set(allIds)];
      await this.updateMetadata((meta) => ({
        ...meta,
        cachedPictogramIds: uniqueIds,
      }));
    } catch (error) {
      console.error("Error caching pictograms:", error);
    }
  }

  async getCachedPictogramsByCategory(categoryId: string): Promise<Pictogram[] | null> {
    try {
      const data = await AsyncStorage.getItem(`${PICTOGRAMS_KEY}_${categoryId}`);
      if (!data) return null;
      const parsed: PictogramCacheData = JSON.parse(data);
      if (Date.now() - parsed.lastFetched > this.CACHE_EXPIRY_MS) {
        await this.clearCategoryCache(categoryId);
        return null;
      }
      return parsed.pictograms;
    } catch (error) {
      console.error("Error getting cached pictograms:", error);
      return null;
    }
  }

  async getAllCachedPictograms(): Promise<Pictogram[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pictogramKeys = keys.filter((k) => k.startsWith(PICTOGRAMS_KEY));
      const results = await AsyncStorage.multiGet(pictogramKeys);
      const allPictograms: Pictogram[] = [];

      results.forEach(([, value]) => {
        if (value) {
          const data: PictogramCacheData = JSON.parse(value);
          allPictograms.push(...data.pictograms);
        }
      });

      const uniqueMap = new Map<string, Pictogram>();
      allPictograms.forEach((p) => uniqueMap.set(p.id, p));
      return Array.from(uniqueMap.values());
    } catch (error) {
      console.error("Error getting all cached pictograms:", error);
      return [];
    }
  }

  async cacheFavoritePictograms(pictograms: Pictogram[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVORITE_PICTOGRAMS_KEY, JSON.stringify(pictograms));
    } catch (error) {
      console.error("Error caching favorites:", error);
    }
  }

  async getFavoritePictograms(): Promise<Pictogram[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITE_PICTOGRAMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting favorite pictograms:", error);
      return [];
    }
  }

  async searchInCache(query: string): Promise<Pictogram[]> {
    const allPictograms = await this.getAllCachedPictograms();
    const lowerQuery = query.toLowerCase();
    return allPictograms.filter((p) => p.keyword.toLowerCase().includes(lowerQuery));
  }

  private async updateMetadata(updateFn: (meta: CacheMetadata) => CacheMetadata): Promise<void> {
    const currentMeta: CacheMetadata = this.metadata || {
      lastUpdated: Date.now(),
      version: this.CACHE_VERSION,
      cachedPictogramIds: [],
      cachedCategoryIds: [],
    };
    this.metadata = updateFn(currentMeta);
    this.metadata.lastUpdated = Date.now();
    await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(this.metadata));
  }

  async clearCategoryCache(categoryId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${PICTOGRAMS_KEY}_${categoryId}`);
      if (this.metadata) {
        this.metadata.cachedPictogramIds = this.metadata.cachedPictogramIds.filter(
          (id) => !id.startsWith(categoryId),
        );
        await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(this.metadata));
      }
    } catch (error) {
      console.error("Error clearing category cache:", error);
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        (k) => k === CACHE_METADATA_KEY || k.startsWith("pictograms") || k === FAVORITE_PICTOGRAMS_KEY || k === CATEGORIES_KEY,
      );
      await AsyncStorage.multiRemove(cacheKeys);
      this.metadata = null;
    } catch (error) {
      console.error("Error clearing all cache:", error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        (k) => k === CACHE_METADATA_KEY || k.startsWith("pictograms") || k === FAVORITE_PICTOGRAMS_KEY || k === CATEGORIES_KEY,
      );
      let totalSize = 0;
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length * 2;
        }
      }
      return totalSize / (1024 * 1024);
    } catch (error) {
      console.error("Error calculating cache size:", error);
      return 0;
    }
  }

  async isPictogramCached(arasaacId: string): Promise<boolean> {
    const allPictograms = await this.getAllCachedPictograms();
    return allPictograms.some((p) => String(p.arasaac_id) === String(arasaacId));
  }
}

export const pictogramCacheService = PictogramCacheService.getInstance();