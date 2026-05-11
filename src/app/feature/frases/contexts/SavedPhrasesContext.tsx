import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pictogram } from '../../expresate/models/pictogram.types';

const SAVED_PHRASES_KEY = '@saved_phrases';
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
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedPhrases = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_PHRASES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedPhrase[];
        setSavedPhrases(parsed.sort((a, b) => b.useCount - a.useCount));
      }
    } catch (e) {
      console.error('Error loading saved phrases:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedPhrases();
  }, [loadSavedPhrases]);

  const savePhrase = useCallback(async (name: string, pictograms: Pictogram[]) => {
    if (pictograms.length === 0) return false;

    try {
      const newPhrase: SavedPhrase = {
        id: Date.now().toString(),
        name,
        pictograms,
        createdAt: Date.now(),
        useCount: 0
      };

      const updated = [newPhrase, ...savedPhrases].slice(0, MAX_SAVED_PHRASES);
      await AsyncStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
      setSavedPhrases(updated);
      return true;
    } catch (e) {
      console.error('Error saving phrase:', e);
      return false;
    }
  }, [savedPhrases]);

  const incrementUseCount = useCallback(async (phraseId: string) => {
    try {
      const updated = savedPhrases.map(p => 
        p.id === phraseId ? { ...p, useCount: p.useCount + 1 } : p
      ).sort((a, b) => b.useCount - a.useCount);
      
      await AsyncStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
      setSavedPhrases(updated);
    } catch (e) {
      console.error('Error incrementing use count:', e);
    }
  }, [savedPhrases]);

  const deletePhrase = useCallback(async (phraseId: string) => {
    try {
      const updated = savedPhrases.filter(p => p.id !== phraseId);
      await AsyncStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
      setSavedPhrases(updated);
    } catch (e) {
      console.error('Error deleting phrase:', e);
    }
  }, [savedPhrases]);

  const renamePhrase = useCallback(async (phraseId: string, newName: string) => {
    try {
      const updated = savedPhrases.map(p => 
        p.id === phraseId ? { ...p, name: newName } : p
      );
      await AsyncStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
      setSavedPhrases(updated);
    } catch (e) {
      console.error('Error renaming phrase:', e);
    }
  }, [savedPhrases]);

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
