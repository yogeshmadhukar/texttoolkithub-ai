// Global Polyfills for PDF.js and Modern ES features on Safari, iPadOS, iOS, Firefox, and older Browsers

if (typeof (Promise as any).withResolvers !== 'function') {
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (typeof Object.hasOwn !== 'function') {
  Object.hasOwn = function (object: any, property: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
}

if (!Array.prototype.at) {
  Array.prototype.at = function (n: number) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) return undefined;
    return this[n];
  };
}

if (!String.prototype.at) {
  String.prototype.at = function (n: number) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) return undefined;
    return this[n];
  };
}

if (typeof URL.canParse !== 'function') {
  URL.canParse = function (url: string | URL, base?: string | URL): boolean {
    try {
      new URL(url as string, base);
      return true;
    } catch {
      return false;
    }
  };
}

if (typeof globalThis !== 'undefined' && typeof (globalThis.Promise as any)?.withResolvers !== 'function') {
  (globalThis.Promise as any).withResolvers = (Promise as any).withResolvers;
}

if (typeof window !== 'undefined' && typeof (window.Promise as any)?.withResolvers !== 'function') {
  (window.Promise as any).withResolvers = (Promise as any).withResolvers;
}

export {};
