type ChromeRuntime = {
  lastError?: { message?: string };
};

type ChromeStorageArea = {
  get: (
    keys: string | string[] | Record<string, unknown> | null,
    callback: (items: Record<string, unknown>) => void,
  ) => void;
  set: (items: Record<string, unknown>, callback?: () => void) => void;
};

declare global {
  interface Window {
    chrome?: {
      runtime?: ChromeRuntime;
      storage?: {
        local?: ChromeStorageArea;
      };
    };
  }
}

export function getChromeStorage(): ChromeStorageArea | undefined {
  return window.chrome?.storage?.local;
}

export function chromeGet(storage: ChromeStorageArea, key: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    storage.get(key, (items) => {
      const error = window.chrome?.runtime?.lastError;

      if (error) {
        reject(new Error(error.message ?? "Could not read extension storage."));
        return;
      }

      resolve(items);
    });
  });
}

export function chromeSet(storage: ChromeStorageArea, items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve, reject) => {
    storage.set(items, () => {
      const error = window.chrome?.runtime?.lastError;

      if (error) {
        reject(new Error(error.message ?? "Could not write extension storage."));
        return;
      }

      resolve();
    });
  });
}
