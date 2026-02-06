import { createJSONStorage } from 'zustand/middleware';

const localStorageAdapter = {
  getItem: async (name: string) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: async (name: string) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const appStorage = createJSONStorage(() => localStorageAdapter);
