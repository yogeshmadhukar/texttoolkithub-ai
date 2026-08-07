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

function getStorage(type: 'localStorage' | 'sessionStorage'): Storage {
  try {
    const storage = window[type];
    if (!storage) {
      return new MemoryStorage();
    }
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return storage;
  } catch (e) {
    return new MemoryStorage();
  }
}

export const safeLocalStorage = getStorage('localStorage');
export const safeSessionStorage = getStorage('sessionStorage');
