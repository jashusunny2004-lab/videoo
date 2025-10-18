import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("lingo-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("lingo-theme", theme);
    set({ theme });
  },
}))