export type TileSize = "normal" | "wide" | "large";
export type BackgroundPosition = "top" | "left" | "center" | "right" | "bottom";

export type TileType = {
  id: string;
  url: string;
  label: string;
  color: string;
  size: TileSize;
  icon?: string;
  iconColor?: string;
  iconSize: number;
  createdAt: string;
  updatedAt: string;
};

export type AppSettings = {
  version: 1;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundPosition: BackgroundPosition;
  gridRows: number;
  tiles: TileType[];
};

export type SettingsExport = {
  app: "realNewTab";
  schemaVersion: 1;
  exportedAt: string;
  settings: AppSettings;
};
