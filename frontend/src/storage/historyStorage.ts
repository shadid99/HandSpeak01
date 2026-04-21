import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '../types';

const HISTORY_KEY = '@translation_history_<USER_ID>'

const getHistoryKey = (userId?: string) => {
  return userId
      ? `@translation_history_${userId}`
      : `@translation_history_guest`;
};

export const saveHistoryItem = async (text: string, confidence: number, userId?: string): Promise<void> => {
  try {
    const key = getHistoryKey(userId);
    const history = await getHistory(userId);

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text,
      confidence,
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [newItem, ...history];
    const limitedHistory = updatedHistory.slice(0, 100);

    await AsyncStorage.setItem(key, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving history item:', error);
    throw error;
  }
};

export const getHistory = async (userId?: string): Promise<HistoryItem[]> => {
  try {
    const key = getHistoryKey(userId);
    const historyJson = await AsyncStorage.getItem(key);

    if (!historyJson) return [];

    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const clearHistory = async (userId?: string): Promise<void> => {
  try {
    const key = getHistoryKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

export const searchHistory = async (query: string, userId?: string): Promise<HistoryItem[]> => {
  try {
    const history = await getHistory(userId);

    if (!query.trim()) return history;

    return history.filter((item) =>
        item.text.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching history:', error);
    return [];
  }
};