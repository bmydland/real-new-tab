import { STORAGE_KEY } from "./constants";

const DB_NAME = "realNewTab";
const STORE_NAME = "settings";
const DB_VERSION = 1;

export async function loadIndexedDbSettings(): Promise<unknown> {
  const db = await openDatabase();
  return readValue(db, STORAGE_KEY);
}

export async function saveIndexedDbSettings(value: unknown): Promise<void> {
  const db = await openDatabase();
  await writeValue(db, STORAGE_KEY, value);
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.addEventListener("upgradeneeded", () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    });

    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error ?? new Error("Could not open IndexedDB.")));
  });
}

function readValue(db: IDBDatabase, key: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error ?? new Error("Could not read IndexedDB.")));
  });
}

function writeValue(db: IDBDatabase, key: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);

    request.addEventListener("success", () => resolve());
    request.addEventListener("error", () => reject(request.error ?? new Error("Could not write IndexedDB.")));
  });
}
