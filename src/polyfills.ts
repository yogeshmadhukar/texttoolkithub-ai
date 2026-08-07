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

// Global interceptors for benign IndexedDB/IDBDatabase connection closing errors and iframe SecurityError/insecure context errors
if (typeof window !== 'undefined') {
  const isBenignError = (err: any): boolean => {
    if (!err) return false;
    const name = err?.name || '';
    const code = err?.code || 0;
    const securityCode = typeof DOMException !== 'undefined' ? DOMException.SECURITY_ERR : 18;
    if (name === 'SecurityError' || code === 18 || code === securityCode) {
      return true;
    }
    const msg = String(err?.message || err?.reason || err || '').toLowerCase();
    return msg.includes('idbdatabase') || 
           msg.includes('database connection is closing') || 
           msg.includes('failed to execute \'transaction\'') ||
           msg.includes('is insecure') ||
           msg.includes('securityerror') ||
           msg.includes('security error') ||
           msg.includes('access is denied') ||
           msg.includes('operation is insecure') ||
           msg.includes('insecure context') ||
           msg.includes('localstorage') ||
           msg.includes('sessionstorage');
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isBenignError(event.reason)) {
      console.warn('Muted benign error/rejection in sandboxed context:', event.reason);
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
    if (isBenignError(event.error) || isBenignError(event.message)) {
      console.warn('Muted benign error in sandboxed context:', event.error || event.message);
      try {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      } catch (e) {
        // ignore
      }
    }
  }, true);
}

export {};
