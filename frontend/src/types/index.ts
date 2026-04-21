export interface TranslationResult {
  label: string;
  confidence: number;
}

export interface HistoryItem {
  id: string;
  text: string;
  confidence: number;
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
