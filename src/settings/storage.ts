import { chromeGet, chromeSet, getChromeStorage } from "./chromeStorage";
import { STORAGE_KEY } from "./constants";
import { loadIndexedDbSettings, saveIndexedDbSettings } from "./indexedDbStorage";
import { migrateSettings } from "./migrateSettings";
import type { AppSettings } from "./types";

export async function loadSettings(): Promise<AppSettings> {
  const storage = getChromeStorage();

  if (storage) {
    const items = await chromeGet(storage, STORAGE_KEY);
    return migrateSettings(items[STORAGE_KEY]);
  }

  return migrateSettings(await loadIndexedDbSettings());
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const normalized = migrateSettings(settings);
  const storage = getChromeStorage();

  if (storage) {
    await chromeSet(storage, { [STORAGE_KEY]: normalized });
    return;
  }

  await saveIndexedDbSettings(normalized);
}
