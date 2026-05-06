import * as Speech from "expo-speech";

type SpeechTask = {
  id: string;
  text: string;
  language: string;
  priority: "high" | "normal" | "low";
  timestamp: number;
};

type SpeechCacheEntry = {
  text: string;
  language: string;
  voiceId: string | null;
  timestamp: number;
};

const SPEECH_CACHE_MAX_SIZE = 50;
const SPEECH_CACHE_EXPIRY_MS = 30 * 60 * 1000;

class SpeechQueueService {
  private static instance: SpeechQueueService;
  private queue: SpeechTask[] = [];
  private isProcessing = false;
  private currentTaskId: string | null = null;
  private speechCache: Map<string, SpeechCacheEntry> = new Map();
  private cachedVoices: Speech.Voice[] = [];

  private constructor() {
    this.initializeCacheCleanup();
  }

  static getInstance(): SpeechQueueService {
    if (!SpeechQueueService.instance) {
      SpeechQueueService.instance = new SpeechQueueService();
    }
    return SpeechQueueService.instance;
  }

  private initializeCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.speechCache) {
        if (now - entry.timestamp > SPEECH_CACHE_EXPIRY_MS) {
          this.speechCache.delete(key);
        }
      }
      if (this.speechCache.size > SPEECH_CACHE_MAX_SIZE) {
        const entriesToDelete = this.speechCache.size - SPEECH_CACHE_MAX_SIZE;
        const keys = Array.from(this.speechCache.keys());
        keys.slice(0, entriesToDelete).forEach((key) => this.speechCache.delete(key));
      }
    }, 60 * 1000);
  }

  private getCacheKey(text: string, language: string): string {
    return `${language}:${text.toLowerCase()}`;
  }

  private async getCachedVoiceId(text: string, language: string): Promise<string | null> {
    const cacheKey = this.getCacheKey(text, language);
    const cached = this.speechCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < SPEECH_CACHE_EXPIRY_MS) {
      return cached.voiceId;
    }
    return null;
  }

  private setCachedVoice(text: string, language: string, voiceId: string | null): void {
    const cacheKey = this.getCacheKey(text, language);
    this.speechCache.set(cacheKey, { text, language, voiceId, timestamp: Date.now() });
  }

  private async loadVoices(): Promise<void> {
    if (this.cachedVoices.length === 0) {
      try {
        this.cachedVoices = await Speech.getAvailableVoicesAsync();
      } catch {
        this.cachedVoices = [];
      }
    }
  }

  private getVoiceOptions(language: string): { language: string; voice?: string } {
    const normalizedLanguage = language === "es" ? "es-ES" : language;
    
    const exactVoice = this.cachedVoices.find(
      (v) => v.language.toLowerCase() === normalizedLanguage.toLowerCase(),
    );

    if (exactVoice) {
      return { language: exactVoice.language, voice: exactVoice.identifier };
    }

    const baseLanguage = normalizedLanguage.split("-")[0]?.toLowerCase();
    const fallbackVoice = this.cachedVoices.find((v) => 
      v.language.toLowerCase().startsWith(baseLanguage || ""),
    );

    if (fallbackVoice) {
      return { language: fallbackVoice.language, voice: fallbackVoice.identifier };
    }

    return { language: normalizedLanguage };
  }

  async speak(text: string, language: string = "es", priority: "high" | "normal" | "low" = "normal"): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: SpeechTask = { id: taskId, text: text.trim(), language, priority, timestamp: Date.now() };

    this.queue.push(task);
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.timestamp - b.timestamp;
    });

    if (!this.isProcessing) {
      this.processQueue();
    }

    return taskId;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      if (this.queue.length === 0) {
        this.isProcessing = false;
      }
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();
    if (!task) {
      this.isProcessing = false;
      return;
    }

    this.currentTaskId = task.id;

    try {
      await this.loadVoices();

      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }

      const cachedVoiceId = await this.getCachedVoiceId(task.text, task.language);
      const voiceOptions = cachedVoiceId
        ? { voice: cachedVoiceId }
        : this.getVoiceOptions(task.language);

      if (!cachedVoiceId && voiceOptions.voice) {
        this.setCachedVoice(task.text, task.language, voiceOptions.voice);
      }

      await new Promise<void>((resolve) => {
        Speech.speak(task.text, {
          ...voiceOptions,
          pitch: 1,
          rate: 0.9,
          volume: 1,
          onDone: () => resolve(),
          onStopped: () => resolve(),
          onError: () => resolve(),
        });
      });
    } catch (error) {
      console.error("Error processing speech task:", error);
    }

    this.currentTaskId = null;
    this.processQueue();
  }

  async stopAll(): Promise<void> {
    this.queue = [];
    this.currentTaskId = null;
    try {
      await Speech.stop();
    } catch {
      // Ignore errors
    }
  }

  async skipCurrent(): Promise<void> {
    if (this.currentTaskId) {
      this.queue = this.queue.filter((t) => t.id !== this.currentTaskId);
      try {
        await Speech.stop();
      } catch {
        // Ignore
      }
    }
  }

  clearQueue(): void {
    this.queue = [];
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getCurrentTaskId(): string | null {
    return this.currentTaskId;
  }

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  }

  getCacheStats(): { size: number } {
    return {
      size: this.speechCache.size,
    };
  }

  clearCache(): void {
    this.speechCache.clear();
  }
}

export const speechQueueService = SpeechQueueService.getInstance();

export async function speakWithQueue(
  text: string,
  language: string = "es",
  priority: "high" | "normal" | "low" = "normal",
): Promise<string> {
  return speechQueueService.speak(text, language, priority);
}

export async function stopSpeaking(): Promise<void> {
  return speechQueueService.stopAll();
}

export async function isCurrentlySpeaking(): Promise<boolean> {
  return speechQueueService.isSpeaking();
}