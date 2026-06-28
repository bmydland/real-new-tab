import { coerceImageDataUrl } from "../utils/image";
import { isRecord } from "../utils/isRecord";
import { DEFAULT_SETTINGS } from "./defaultSettings";
import { legacyTileToTile } from "./legacyImport";
import { migrateSettings } from "./migrateSettings";
import type { AppSettings, SettingsExport, Tile } from "./types";

export function createSettingsExport(settings: AppSettings): SettingsExport {
  return {
    app: "realNewTab",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    settings: migrateSettings(settings),
  };
}

export function parseSettingsImport(rawJson: string, current = DEFAULT_SETTINGS): AppSettings {
  const parsed = JSON.parse(rawJson) as unknown;

  if (Array.isArray(parsed)) {
    return {
      ...current,
      tiles: parsed.map(legacyTileToTile).filter(isTile),
    };
  }

  if (isRecord(parsed) && parsed.app === "realNewTab" && isRecord(parsed.settings)) {
    return migrateSettings(parsed.settings);
  }

  if (isRecord(parsed) && Array.isArray(parsed.tiles)) {
    return migrateSettings(parsed);
  }

  if (isRecord(parsed) && typeof parsed.apar_bgimg === "string") {
    return {
      ...current,
      backgroundImage: coerceImageDataUrl(parsed.apar_bgimg),
    };
  }

  throw new Error("This file is not a realNewTab settings export.");
}

function isTile(value: Tile | null): value is Tile {
  return value !== null;
}
