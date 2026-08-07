class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return index >= 0 && index < keys.length ? keys[index] : null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

class SafeStorage implements Storage {
  private primary: Storage | null = null;
  private fallback: MemoryStorage;

  constructor(type: 'localStorage' | 'sessionStorage') {
    this.fallback = new MemoryStorage();
    try {
      if (typeof window !== 'undefined' && window[type]) {
        const testKey = '__storage_test__';
        window[type].setItem(testKey, testKey);
        window[type].removeItem(testKey);
        this.primary = window[type];
      }
    } catch {
      this.primary = null;
    }
  }

  get length(): number {
    if (this.primary) {
      try {
        return this.primary.length;
      } catch {
        // Fallback
      }
    }
    return this.fallback.length;
  }

  clear(): void {
    if (this.primary) {
      try {
        this.primary.clear();
      } catch {
        // Fallback
      }
    }
    this.fallback.clear();
  }

  getItem(key: string): string | null {
    if (this.primary) {
      try {
        return this.primary.getItem(key);
      } catch {
        // Fallback
      }
    }
    return this.fallback.getItem(key);
  }

  key(index: number): string | null {
    if (this.primary) {
      try {
        return this.primary.key(index);
      } catch {
        // Fallback
      }
    }
    return this.fallback.key(index);
  }

  removeItem(key: string): void {
    if (this.primary) {
      try {
        this.primary.removeItem(key);
      } catch {
        // Fallback
      }
    }
    this.fallback.removeItem(key);
  }

  setItem(key: string, value: string): void {
    if (this.primary) {
      try {
        this.primary.setItem(key, value);
      } catch {
        // Fallback
      }
    }
    this.fallback.setItem(key, value);
  }
}

export const safeLocalStorage = new SafeStorage('localStorage');
export const safeSessionStorage = new SafeStorage('sessionStorage');

