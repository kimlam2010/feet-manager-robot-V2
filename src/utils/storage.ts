interface StorageOptions {
  prefix?: string;
  expiry?: number; // in milliseconds
}

interface StorageItem<T> {
  value: T;
  expiry?: number;
}

export class Storage {
  private prefix: string;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || 'app';
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  set<T>(key: string, value: T, expiry?: number): void {
    const item: StorageItem<T> = {
      value,
      expiry: expiry ? Date.now() + expiry : undefined,
    };

    localStorage.setItem(this.getKey(key), JSON.stringify(item));
  }

  get<T>(key: string): T | null {
    const item = localStorage.getItem(this.getKey(key));
    if (!item) return null;

    const { value, expiry } = JSON.parse(item) as StorageItem<T>;

    if (expiry && Date.now() > expiry) {
      this.remove(key);
      return null;
    }

    return value;
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}
