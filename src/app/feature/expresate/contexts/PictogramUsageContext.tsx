import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pictogram } from '../models/pictogram.types';

const USAGE_STORAGE_KEY = '@pictogram_usage_history';
const MAX_RECENT_ITEMS = 12;
const MAX_TOP_ITEMS = 20;

interface UsageEntry {
  count: number;
  lastUsed: number;
  pictogram: Pictogram;
}

interface UsageData {
  [id: string]: UsageEntry;
}

interface PictogramUsageContextType {
  recentPictograms: Pictogram[];
  topPictograms: Pictogram[];
  trackUsage: (pictogram: Pictogram) => Promise<void>;
  clearOldData: () => Promise<void>;
}

const PictogramUsageContext = createContext<PictogramUsageContextType | undefined>(undefined);

export const PictogramUsageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usageData, setUsageData] = useState<UsageData>({});
  const [recentPictograms, setRecentPictograms] = useState<Pictogram[]>([]);
  const [topPictograms, setTopPictograms] = useState<Pictogram[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadUsageData = async () => {
      try {
        const stored = await AsyncStorage.getItem(USAGE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUsageData(parsed);
        }
      } catch (e) {
        console.error('Error loading pictogram usage:', e);
      }
    };
    loadUsageData();
  }, []);

  // Actualizar listas derivadas
  useEffect(() => {
    const items = Object.values(usageData);
    if (items.length === 0) {
      setRecentPictograms([]);
      setTopPictograms([]);
      return;
    }

    const top = [...items]
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_TOP_ITEMS)
      .map(i => i.pictogram);
    setTopPictograms(top);

    const recent = [...items]
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, MAX_RECENT_ITEMS)
      .map(i => i.pictogram);
    setRecentPictograms(recent);
  }, [usageData]);

  const trackUsage = useCallback(async (pictogram: Pictogram) => {
    if (!pictogram?.id) return;

    const idStr = pictogram.id.toString();
    
    setUsageData(prev => {
      const currentEntry = prev[idStr] || { count: 0, lastUsed: 0, pictogram };
      
      const newEntry: UsageEntry = {
        count: currentEntry.count + 1,
        lastUsed: Date.now(),
        pictogram
      };

      const newData = {
        ...prev,
        [idStr]: newEntry
      };

      AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(newData)).catch(err => 
        console.error('Error saving usage to storage:', err)
      );

      return newData;
    });
  }, []);

  const clearOldData = async () => {
    try {
      await AsyncStorage.removeItem(USAGE_STORAGE_KEY);
      setUsageData({});
    } catch (e) {
      console.error('Error clearing usage data:', e);
    }
  };

  return (
    <PictogramUsageContext.Provider value={{ recentPictograms, topPictograms, trackUsage, clearOldData }}>
      {children}
    </PictogramUsageContext.Provider>
  );
};

export const usePictogramUsage = () => {
  const context = useContext(PictogramUsageContext);
  if (context === undefined) {
    throw new Error('usePictogramUsage must be used within a PictogramUsageProvider');
  }
  return context;
};
