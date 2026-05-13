import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pictogram } from '../../expresate/models/pictogram.types';
import { useActiveProfile } from '@/src/app/contexts/ActiveProfileContext';

const BASE_SAVED_PHRASES_KEY = '@saved_phrases';
const MAX_SAVED_PHRASES = 20;

export interface SavedPhrase {
  id: string;
  name: string;
  pictograms: Pictogram[];
  createdAt: number;
  useCount: number;
}

interface SavedPhrasesContextType {
  savedPhrases: SavedPhrase[];
  isLoading: boolean;
  savePhrase: (name: string, pictograms: Pictogram[]) => Promise<boolean>;
  incrementUseCount: (phraseId: string) => Promise<void>;
  deletePhrase: (phraseId: string) => Promise<void>;
  renamePhrase: (phraseId: string, newName: string) => Promise<void>;
}

const SavedPhrasesContext = createContext<SavedPhrasesContextType | undefined>(undefined);

export const SavedPhrasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { id: profileId } = useActiveProfile();
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = useMemo(() => 
    profileId ? `${BASE_SAVED_PHRASES_KEY}_${profileId}` : null
  , [profileId]);

  const loadSavedPhrases = useCallback(async () => {
    if (!storageKey) {
      setSavedPhrases([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedPhrase[];
        setSavedPhrases(parsed.sort((a, b) => b.useCount - a.useCount));
      } else {
        setSavedPhrases([]);
      }
    } catch (e) {
      console.error('Error loading saved phrases:', e);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    loadSavedPhrases();
  }, [loadSavedPhrases]);

  const savePhrase = useCallback(async (name: string, pictograms: Pictogram[]) => {
    if (pictograms.length === 0 || !storageKey) return false;

    try {
      const newPhrase: SavedPhrase = {
        id: Date.now().toString(),
        name,
        pictograms,
        createdAt: Date.now(),
        useCount: 0
      };

      const updated = [newPhrase, ...savedPhrases].slice(0, MAX_SAVED_PHRASES);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      setSavedPhrases(updated);
      return true;
    } catch (e) {
      console.error('Error saving phrase:', e);
      return false;
    }
  }, [savedPhrases, storageKey]);

  const incrementUseCount = useCallback(async (phraseId: string) => {
    if (!storageKey) return;
    try {
      const updated = savedPhrases.map(p => 
        p.id === phraseId ? { ...p, useCount: p.useCount + 1 } : p
      ).sort((a, b) => b.useCount - a.useCount);
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      setSavedPhrases(updated);
    } catch (e) {
      console.error('Error incrementing use count:', e);
    }
  }, [savedPhrases, storageKey]);

  const deletePhrase = useCallback(async (phraseId: string) => {
    if (!storageKey) return;
    try {
      const updated = savedPhrases.filter(p => p.id !== phraseId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      setSavedPhrases(updated);
    } catch (e) {
      console.error('Error deleting phrase:', e);
    }
  }, [savedPhrases, storageKey]);

  const renamePhrase = useCallback(async (phraseId: string, newName: string) => {
    if (!storageKey) return;
    try {
      const updated = savedPhrases.map(p => 
        p.id === phraseId ? { ...p, name: newName } : p
      );
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      setSavedPhrases(updated);
    } catch (e) {
      console.error('Error renaming phrase:', e);
    }
  }, [savedPhrases, storageKey]);

  return (
    <SavedPhrasesContext.Provider value={{ 
      savedPhrases, 
      isLoading, 
      savePhrase, 
      incrementUseCount, 
      deletePhrase, 
      renamePhrase 
    }}>
      {children}
    </SavedPhrasesContext.Provider>
  );
};

export const useSavedPhrases = () => {
  const context = useContext(SavedPhrasesContext);
  if (context === undefined) {
    throw new Error('useSavedPhrases must be used within a SavedPhrasesProvider');
  }
  return context;
};
