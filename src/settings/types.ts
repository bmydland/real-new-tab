export type TileSize = "normal" | "wide" | "large";

export type TileType = {
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
  gridRows: number;
  tiles: TileType[];
};

export type SettingsExport = {
  app: "realNewTab";
  schemaVersion: 1;
  exportedAt: string;
  settings: AppSettings;
};
