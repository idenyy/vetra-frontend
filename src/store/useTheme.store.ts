import { create } from 'zustand';
import { ThemeState } from '../types/store.type.ts';

export const useTheme = create<ThemeState>((set) => ({
  theme: localStorage.getItem('chat-theme') || 'black',
  setTheme: (theme: string) => {
    localStorage.setItem('chat-theme', theme);
    set({ theme });
  }
}));
