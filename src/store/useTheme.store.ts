import { create } from 'zustand';

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: localStorage.getItem('chat-theme') || 'black',
  setTheme: (theme: string) => {
    localStorage.setItem('chat-theme', theme);
    set({ theme });
  }
}));
