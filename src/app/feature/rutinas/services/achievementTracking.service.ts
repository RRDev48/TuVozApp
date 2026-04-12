import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@tuvozapp:shown_achievements";

interface ShownAchievement {
  id: string;
  shownAt: string;
}

/**
 * Servicio para rastrear qué logros ya se han mostrado al usuario.
 * Previene que el mismo logro se muestre múltiples veces.
 */
class AchievementTrackingService {
  private shownAchievements: Set<string> = new Set();
  private initialized = false;

  /**
   * Inicializa el servicio cargando los logros ya mostrados desde el almacenamiento.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const achievements: ShownAchievement[] = JSON.parse(stored);
        this.shownAchievements = new Set(achievements.map((a) => a.id));
      }
      this.initialized = true;
    } catch (error) {
      console.error("Error loading shown achievements:", error);
      this.shownAchievements = new Set();
      this.initialized = true;
    }
  }

  /**
   * Verifica si un logro ya fue mostrado.
   */
  async hasBeenShown(achievementId: string): Promise<boolean> {
    await this.initialize();
    return this.shownAchievements.has(achievementId);
  }

  /**
   * Marca un logro como mostrado.
   */
  async markAsShown(achievementId: string): Promise<void> {
    await this.initialize();

    if (this.shownAchievements.has(achievementId)) {
      return; // Ya fue marcado
    }

    this.shownAchievements.add(achievementId);

    try {
      const achievements: ShownAchievement[] = Array.from(
        this.shownAchievements,
      ).map((id) => ({
        id,
        shownAt: new Date().toISOString(),
      }));

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error("Error saving shown achievement:", error);
    }
  }

  /**
   * Limpia todos los logros mostrados (útil para testing o reset).
   */
  async clearAll(): Promise<void> {
    this.shownAchievements.clear();
    this.initialized = false;
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing shown achievements:", error);
    }
  }

  /**
   * Genera un ID único para un logro de rutina al 100%.
   */
  getRoutineAchievementId(routineId: number): string {
    return `routine-${routineId}-completed`;
  }

  /**
   * Genera un ID único para un logro de semana al 100%.
   */
  getWeekAchievementId(weekStart: Date): string {
    const dateStr = weekStart.toISOString().slice(0, 10);
    return `week-${dateStr}-completed`;
  }
}

export const achievementTrackingService = new AchievementTrackingService();
