import type { TileType } from "~/settings";

export function hasTileOrderChanged(
  previousTiles: TileType[],
  nextTiles: TileType[],
) {
  return (
    previousTiles.length !== nextTiles.length ||
    previousTiles.some((tile, index) => tile.id !== nextTiles[index]?.id)
  );
}
