import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { pictogramCacheService } from "../../expresate/services/pictogramCache.Service";

const CONFIG_VERSION = "1.0.0";
const PROFILES_KEY = "profiles_config";
const PERSONALIZATION_KEY = "personalization_config";
const EMERGENCY_KEY = "emergency_config";
const EXPORT_STORAGE_KEY = "tuvoz_export_pending";
const EXPORT_FILENAME_KEY = "tuvoz_last_export";

export type ExportConfig = {
  version: string;
  exportedAt: number;
  deviceInfo: {
    platform: string;
    appVersion: string;
  };
  profiles: ProfileExportData[];
  personalization: PersonalizationExportData;
  emergencyData: EmergencyExportData;
  favoritePictograms: string[];
  statistics: ExportStatistics;
};

type ProfileExportData = {
  id: string;
  name: string;
  avatarUrl?: string;
  isActive: boolean;
  preferences: Record<string, unknown>;
};

type PersonalizationExportData = {
  temaOscuro: boolean;
  transformText: boolean;
  fontSize: string;
  language: string;
};

type EmergencyExportData = {
  bloodType?: string;
  allergies: { name: string; severity: string }[];
  medications: { name: string; dosage: string }[];
  addresses: { name: string; fullAddress: string }[];
  emergencyContacts: { name: string; phone: string; relation: string }[];
  notes?: string;
  alertMode?: string;
};

type ExportStatistics = {
  totalProfiles: number;
  totalFavorites: number;
  totalCacheSize: number;
};

class ConfigExportService {
  private static instance: ConfigExportService;

  private constructor() {}

  static getInstance(): ConfigExportService {
    if (!ConfigExportService.instance) {
      ConfigExportService.instance = new ConfigExportService();
    }
    return ConfigExportService.instance;
  }

  async exportConfiguration(): Promise<string> {
    const [profiles, personalization, emergencyData, favorites, cacheSize] = await Promise.all([
      this.getProfilesData(),
      this.getPersonalizationData(),
      this.getEmergencyData(),
      this.getFavoritePictograms(),
      pictogramCacheService.getCacheSize(),
    ]);

    const exportData: ExportConfig = {
      version: CONFIG_VERSION,
      exportedAt: Date.now(),
      deviceInfo: {
        platform: Platform.OS,
        appVersion: "1.0.0",
      },
      profiles,
      personalization,
      emergencyData,
      favoritePictograms: favorites,
      statistics: {
        totalProfiles: profiles.length,
        totalFavorites: favorites.length,
        totalCacheSize: cacheSize,
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  async saveExportToFile(): Promise<string> {
    const exportJson = await this.exportConfiguration();
    const fileName = `tuvoz_backup_${new Date().toISOString().split("T")[0]}.json`;
    
    await AsyncStorage.setItem(EXPORT_STORAGE_KEY, exportJson);
    await AsyncStorage.setItem(EXPORT_FILENAME_KEY, fileName);

    return fileName;
  }

  async getSavedExport(): Promise<string | null> {
    return AsyncStorage.getItem(EXPORT_STORAGE_KEY);
  }

  async clearSavedExport(): Promise<void> {
    await AsyncStorage.multiRemove([EXPORT_STORAGE_KEY, EXPORT_FILENAME_KEY]);
  }

  async importConfiguration(jsonString: string): Promise<{ success: boolean; message: string; restoredItems: number }> {
    try {
      const importData = JSON.parse(jsonString) as ExportConfig;

      if (!importData.version) {
        throw new Error("Archivo de importación inválido");
      }

      let restoredItems = 0;

      if (importData.profiles && importData.profiles.length > 0) {
        await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(importData.profiles));
        restoredItems += importData.profiles.length;
      }

      if (importData.personalization) {
        await AsyncStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(importData.personalization));
        restoredItems++;
      }

      if (importData.emergencyData) {
        await AsyncStorage.setItem(EMERGENCY_KEY, JSON.stringify(importData.emergencyData));
        restoredItems++;
      }

      return {
        success: true,
        message: `Se restauraron ${restoredItems} elementos`,
        restoredItems,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al importar la configuración",
        restoredItems: 0,
      };
    }
  }

  async importFromJson(jsonString: string): Promise<{ success: boolean; message: string; restoredItems: number }> {
    return this.importConfiguration(jsonString);
  }

  private async getProfilesData(): Promise<ProfileExportData[]> {
    try {
      const profilesJson = await AsyncStorage.getItem(PROFILES_KEY);
      return profilesJson ? JSON.parse(profilesJson) : [];
    } catch {
      return [];
    }
  }

  private async getPersonalizationData(): Promise<PersonalizationExportData> {
    try {
      const personalizationJson = await AsyncStorage.getItem(PERSONALIZATION_KEY);
      return personalizationJson
        ? JSON.parse(personalizationJson)
        : {
            temaOscuro: false,
            transformText: false,
            fontSize: "medium",
            language: "es",
          };
    } catch {
      return {
        temaOscuro: false,
        transformText: false,
        fontSize: "medium",
        language: "es",
      };
    }
  }

  private async getEmergencyData(): Promise<EmergencyExportData> {
    try {
      const emergencyJson = await AsyncStorage.getItem(EMERGENCY_KEY);
      return emergencyJson ? JSON.parse(emergencyJson) : { allergies: [], medications: [], addresses: [], emergencyContacts: [] };
    } catch {
      return { allergies: [], medications: [], addresses: [], emergencyContacts: [] };
    }
  }

  private async getFavoritePictograms(): Promise<string[]> {
    try {
      const favorites = await pictogramCacheService.getFavoritePictograms();
      return favorites.map((p) => p.id);
    } catch {
      return [];
    }
  }

  async getExportPreview(): Promise<{ profiles: number; favorites: number; cacheSize: number }> {
    try {
      const [profiles, favorites, cacheSize] = await Promise.all([
        this.getProfilesData(),
        this.getFavoritePictograms(),
        pictogramCacheService.getCacheSize(),
      ]);

      return {
        profiles: profiles.length,
        favorites: favorites.length,
        cacheSize,
      };
    } catch {
      return { profiles: 0, favorites: 0, cacheSize: 0 };
    }
  }
}

export const configExportService = ConfigExportService.getInstance();