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

// Global interceptors for benign IndexedDB/IDBDatabase connection closing errors
if (typeof window !== 'undefined') {
  const isIdbError = (err: any): boolean => {
    if (!err) return false;
    const msg = String(err.message || err.reason || err || '').toLowerCase();
    return msg.includes('idbdatabase') || 
           msg.includes('database connection is closing') || 
           msg.includes('failed to execute \'transaction\'');
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isIdbError(event.reason)) {
      console.warn('Muted benign IndexedDB/IDBDatabase unhandled rejection:', event.reason);
      try {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      } catch (e) {
        // ignore
      }
    }
  }, true);

  window.addEventListener('error', (event) => {
    if (isIdbError(event.error) || isIdbError(event.message)) {
      console.warn('Muted benign IndexedDB/IDBDatabase error:', event.error || event.message);
      try {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      } catch (e) {
        // ignore
      }
    }
  }, true);

  // Patch window.Worker to intercept worker errors
  if (window.Worker) {
    const OriginalWorker = window.Worker;
    const PatchedWorker = function (this: any, stringUrl: string | URL, options?: WorkerOptions) {
      const worker = new OriginalWorker(stringUrl, options);
      
      worker.addEventListener('error', (event: ErrorEvent) => {
        const msg = String(event.message || event.error?.message || '').toLowerCase();
        if (msg.includes('idbdatabase') || 
            msg.includes('database connection is closing') || 
            msg.includes('failed to execute \'transaction\'')) {
          console.warn('Muted benign IndexedDB/IDBDatabase error in Web Worker:', event.message || event.error);
          try {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
          } catch (e) {
            // ignore
          }
        }
      });

      return worker;
    } as any;

    PatchedWorker.prototype = OriginalWorker.prototype;
    
    Object.getOwnPropertyNames(OriginalWorker).forEach((prop) => {
      if (!(prop in PatchedWorker)) {
        try {
          Object.defineProperty(PatchedWorker, prop, Object.getOwnPropertyDescriptor(OriginalWorker, prop)!);
        } catch (e) {
          // ignore read-only fields
        }
      }
    });

    window.Worker = PatchedWorker;
  }
}

export {};
