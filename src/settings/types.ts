export type TileSize = "normal" | "wide" | "large";

export type Tile = {
  id: string;
  url: string;
  label: string;
  color: string;
  size: TileSize;
  icon?: string;
  createdAt: string;
  updatedAt: string;
};

export type AppSettings = {
  version: 1;
  backgroundColor: string;
  backgroundImage?: string;
  tiles: Tile[];
};

export type SettingsExport = {
  app: "realNewTab";
  schemaVersion: 1;
  exportedAt: string;
  settings: AppSettings;
};
