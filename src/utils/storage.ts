export const storage = {
  get: (key: string): any => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      }
    }
    return null;
  },

  set: (key: string, value: any): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      );
    }
  },

  remove: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },

  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  },
}; 