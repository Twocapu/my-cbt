import type { ExamResultHistory } from '../types/exam';

const STORAGE_KEY_RESULTS = 'sports_cbt_history_v1';
const STORAGE_KEY_THEME = 'sports_cbt_theme_v1';

export const saveExamResult = (result: ExamResultHistory): void => {
  try {
    const existing = getExamHistory();
    const updated = [result, ...existing];
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save exam result to localStorage:', error);
  }
};

export const getExamHistory = (): ExamResultHistory[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse exam history from localStorage:', error);
    return [];
  }
};

export const clearExamHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_RESULTS);
  } catch (error) {
    console.error('Failed to clear exam history:', error);
  }
};

export const getTheme = (): 'light' | 'dark' => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};
