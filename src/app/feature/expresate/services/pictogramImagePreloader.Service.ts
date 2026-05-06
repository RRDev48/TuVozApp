import { Image as ExpoImage } from "expo-image";

const ARASAAC_BASE_URL = "https://api.arasaac.org/v1/pictograms";

type PreloadedImage = {
  uri: string;
  timestamp: number;
};

class PictogramImagePreloader {
  private static instance: PictogramImagePreloader;
  private preloadedIds: Set<string> = new Set();
  private frequentlyUsedIds: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<boolean>> = new Map();
  private readonly MAX_PRELOADED = 200;
  private readonly BATCH_SIZE = 10;
  private readonly PRIORITY_IDS: string[] = [
    "3436", "3437", "3438", "162", "163", "164", "165", "166", "167", "168",
    "2530", "2531", "2532", "1043", "1044", "1045", "1118", "1119", "1120",
    "2088", "2089", "2090", "1053", "1054", "1055", "1580", "1581", "1582",
    "2522", "2523", "2524", "1379", "1380", "1381", "2372", "2373", "2374",
    "1153", "1154", "1155", "1586", "1587", "1588", "1727", "1728", "1729",
  ];

  private constructor() {}

  static getInstance(): PictogramImagePreloader {
    if (!PictogramImagePreloader.instance) {
      PictogramImagePreloader.instance = new PictogramImagePreloader();
    }
    return PictogramImagePreloader.instance;
  }

  private getImageUri(arasaacId: string): string {
    return `${ARASAAC_BASE_URL}/${arasaacId}`;
  }

  async preloadPriorityImages(): Promise<void> {
    if (this.PRIORITY_IDS.length === 0) return;

    const batch = this.PRIORITY_IDS.slice(0, this.BATCH_SIZE);
    await this.preloadBatch(batch);

    if (this.PRIORITY_IDS.length > this.BATCH_SIZE) {
      setTimeout(() => {
        this.preloadPriorityImages();
      }, 500);
    }
  }

  async preloadBatch(arasaacIds: string[]): Promise<void> {
    const promises = arasaacIds.map((id) => this.preloadImage(id));
    await Promise.all(promises);
  }

  async preloadImage(arasaacId: string): Promise<boolean> {
    const key = String(arasaacId);

    if (this.preloadedIds.has(key)) {
      this.frequentlyUsedIds.add(key);
      return true;
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }

    const promise = new Promise<boolean>((resolve) => {
      ExpoImage.prefetch(this.getImageUri(key))
        .then(() => {
          this.preloadedIds.add(key);
          this.frequentlyUsedIds.add(key);
          this.cleanupIfNeeded();
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });

    this.loadingPromises.set(key, promise);
    return promise;
  }

  private cleanupIfNeeded(): void {
    if (this.preloadedIds.size <= this.MAX_PRELOADED) return;

    const diff = this.preloadedIds.size - this.MAX_PRELOADED + 20;
    const entries = Array.from(this.preloadedIds);

    for (let i = entries.length - 1; i >= 0 && diff > 0; i--) {
      const id = entries[i];
      if (!this.frequentlyUsedIds.has(id)) {
        this.preloadedIds.delete(id);
      }
    }
  }

  isPreloaded(arasaacId: string): boolean {
    return this.preloadedIds.has(String(arasaacId));
  }

  getPreloadedCount(): number {
    return this.preloadedIds.size;
  }

  async preloadCategory(_categoryId: string, pictogramIds: string[]): Promise<void> {
    for (let i = 0; i < pictogramIds.length; i += this.BATCH_SIZE) {
      const batch = pictogramIds.slice(i, i + this.BATCH_SIZE);
      await this.preloadBatch(batch);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  preloadInBackground(arasaacIds: string[]): void {
    const notPreloaded = arasaacIds.filter((id) => !this.isPreloaded(id));
    if (notPreloaded.length === 0) return;

    setTimeout(() => {
      this.preloadBatch(notPreloaded).catch(() => {});
    }, 1000);
  }

  clearCache(): void {
    this.preloadedIds.clear();
    this.frequentlyUsedIds.clear();
    this.loadingPromises.clear();
  }
}

export const pictogramImagePreloader = PictogramImagePreloader.getInstance();